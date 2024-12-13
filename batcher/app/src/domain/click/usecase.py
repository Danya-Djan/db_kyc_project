from datetime import datetime
import decimal
from typing import Tuple
import aiohttp
import redis.asyncio as redis
import aio_pika
import asyncpg

from app.src.domain.setting import get_setting
from .repos.redis import (
    get_period_sum, incr_period_sum, get_max_period_sum, get_user_total, get_global_average,
    incr_user_count_if_no_clicks, update_global_average, incr_user_total, compare_max_period_sum,
    delete_user_info as r_delete_user_info, get_user_session, set_user_session, set_energy, get_energy as r_get_energy,
    decr_energy,
)
from .repos.pg import update_click_expiry, bulk_store_copy, delete_by_user_id
from .repos.rmq import send_click_batch_copy
from .models import Click


PRECISION = 2


async def add_click_batch_copy(r: redis.Redis, pg: asyncpg.Connection,  rmq: aio_pika.Channel, user_id: int, count: int) -> Click:
    _click_value = await click_value(r, pg, user_id)
    click_value_sum = _click_value * count

    # update variables
    await incr_user_count_if_no_clicks(r, user_id)
    await update_global_average(r, click_value_sum)
    await incr_user_total(r, user_id, click_value_sum)

    for period in (24, 24*7):
        new_period_sum = await incr_period_sum(r, user_id, period, click_value_sum)
        await compare_max_period_sum(r, period, new_period_sum)

    click = Click(
        userId=user_id,
        dateTime=datetime.now(),
        value=_click_value,
    )

    # insert click
    await bulk_store_copy(pg, click, count)

    # send click to backend
    await send_click_batch_copy(rmq, click, count)

    return click


async def delete_user_info(r: redis.Redis, pg: asyncpg.Connection, user_id: int) -> None:
    await r_delete_user_info(r, user_id, [24, 168])
    await delete_by_user_id(pg, user_id)


async def click_value(r: redis.Redis, pg: asyncpg.Connection, user_id: int) -> decimal.Decimal:
    price_per_click = get_setting('PRICE_PER_CLICK')
    day_multiplier = get_setting('DAY_MULT')
    week_multiplier = get_setting('WEEK_MULT')
    progress_multiplier = get_setting('PROGRESS_MULT')

    # period coefficients
    day_coef = await period_coefficient(r, pg, user_id, 24, day_multiplier)
    week_coef = await period_coefficient(r, pg, user_id, 24*7, week_multiplier)

    # progress coefficient
    user_total = await get_user_total(r, user_id)
    global_avg = await get_global_average(r)
    progress_coef = progress_coefficient(user_total, global_avg, progress_multiplier)

    return round(price_per_click * day_coef * week_coef * progress_coef, PRECISION)


async def period_coefficient(r: redis.Redis, pg: asyncpg.Connection, user_id: int, period: int, multiplier: decimal.Decimal) -> decimal.Decimal:
    current_sum = await get_period_sum(r, user_id, period)
    expired_sum = await update_click_expiry(pg, user_id, period)
    new_sum = current_sum - expired_sum
    await incr_period_sum(r, user_id, period, -expired_sum)
    max_period_sum = await get_max_period_sum(r, period)
    if max_period_sum == decimal.Decimal(0):
        return decimal.Decimal(1)
    return new_sum * multiplier / max_period_sum + 1


def progress_coefficient(user_total: decimal.Decimal, global_avg: decimal.Decimal, multiplier: decimal.Decimal) -> decimal.Decimal:
    if user_total == decimal.Decimal(0):
        return decimal.Decimal(1)
    return min(global_avg * multiplier / user_total + 1, decimal.Decimal(2))


async def check_registration(r: redis.Redis, user_id: int, _token: str, backend_url: str) -> bool:
    if await _has_any_clicks(r, user_id):
        return True
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{backend_url}/api/v1/users/{user_id}', headers={'Authorization': _token}) as resp:
            return resp.status == 200


async def _has_any_clicks(r: redis.Redis, user_id: int) -> bool:
    total_value = await get_user_total(r, user_id)
    return total_value > decimal.Decimal(0)


async def _get_refresh_energy(r: redis.Redis, user_id: int, req_token: str) -> int:
    current_token = await get_user_session(r, user_id)
    if current_token != req_token:
        session_energy = int(get_setting('SESSION_ENERGY'))
        await set_user_session(r, user_id, req_token)
        await set_energy(r, user_id, session_energy)
        return session_energy
    else:
        return await r_get_energy(r, user_id)


async def check_energy(r: redis.Redis, user_id: int, amount: int, _token: str) -> Tuple[int, int]:
    _energy = await _get_refresh_energy(r, user_id, _token)
    if _energy == 0:
        return 0, 0
    return await decr_energy(r, user_id, amount)


async def get_energy(r: redis.Redis, user_id: int, _token: str) -> int:
    return await _get_refresh_energy(r, user_id, _token)
