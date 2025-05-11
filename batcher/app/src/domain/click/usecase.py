from datetime import datetime
import decimal
from typing import Tuple
import aiohttp
import aio_pika
import asyncpg
import base64
from fastapi.exceptions import HTTPException

from app.src.domain.setting import get_setting
from .repos.pg import (
    store, delete_user_info as pg_delete_user_info, get_period_sum, get_max_period_sum, get_global_average, get_user_total, user_exists, get_user_session,
    set_new_session, get_energy as pg_get_energy, decr_energy, add_user
)
from .repos.rmq import send_click
from .models import Click


PRECISION = 2


async def add_click_batch_copy(pg: asyncpg.Connection,  rmq: aio_pika.Channel, user_id: int, count: int) -> Click:
    _click_value = await click_value(pg, user_id)

    click = Click(
        userId=user_id,
        dateTime=datetime.now(),
        value=_click_value,
        count=count,
    )

    # insert click
    await store(pg, click)

    # send click to backend
    await send_click(rmq, click)

    return click


async def delete_user_info(pg: asyncpg.Connection, user_id: int) -> None:
    await pg_delete_user_info(pg, user_id)


async def click_value(pg: asyncpg.Connection, user_id: int) -> decimal.Decimal:
    price_per_click = get_setting('PRICE_PER_CLICK')
    day_multiplier = get_setting('DAY_MULT')
    week_multiplier = get_setting('WEEK_MULT')
    progress_multiplier = get_setting('PROGRESS_MULT')

    # period coefficients
    day_coef = await period_coefficient(pg, user_id, 24, day_multiplier)
    week_coef = await period_coefficient(pg, user_id, 24*7, week_multiplier)

    # progress coefficient
    user_total = await get_user_total(pg, user_id)
    global_avg = await get_global_average(pg)
    progress_coef = progress_coefficient(user_total, global_avg, progress_multiplier)

    return round(price_per_click * day_coef * week_coef * progress_coef, PRECISION)


async def period_coefficient(pg: asyncpg.Connection, user_id: int, period: int, multiplier: decimal.Decimal) -> decimal.Decimal:
    current_period_sum = await get_period_sum(pg, user_id, period)
    max_period_sum = await get_max_period_sum(pg, period)
    if max_period_sum == decimal.Decimal(0):
        return decimal.Decimal(1)
    return current_period_sum * multiplier / max_period_sum + 1


def progress_coefficient(user_total: decimal.Decimal, global_avg: decimal.Decimal, multiplier: decimal.Decimal) -> decimal.Decimal:
    if user_total == decimal.Decimal(0):
        return decimal.Decimal(1)
    return min(global_avg * multiplier / user_total + 1, decimal.Decimal(2))


async def check_registration(pg: asyncpg.Connection, user_id: int, _token: str, backend_url: str) -> bool:
    if await user_exists(pg, user_id):
        return True
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{backend_url}/api/v1/users/{user_id}', headers={'Authorization': f'TelegramToken {_token}'}) as resp:
            return resp.status == 200


async def _get_refresh_energy(pg: asyncpg.Connection, user_id: int, req_token: str) -> int:
    new_auth_date = _auth_date_from_token(req_token)
    current_token = await get_user_session(pg, user_id)
    if current_token is None:
        session_energy = int(get_setting('SESSION_ENERGY'))
        await add_user(pg, user_id, req_token, session_energy)
        return session_energy
    if current_token != req_token:
        last_auth_date = _auth_date_from_token(current_token)
        session_cooldown = get_setting('SESSION_COOLDOWN')
        if new_auth_date - last_auth_date < session_cooldown:
            raise HTTPException(status_code=403, detail='Unauthorized')
        session_energy = int(get_setting('SESSION_ENERGY'))
        await set_new_session(pg, user_id, req_token, session_energy)
        return session_energy
    else:
        return await pg_get_energy(pg, user_id)

def _auth_date_from_token(token):
    split_res = base64.b64decode(token).decode('utf-8').split(':')
    data_check_string = ':'.join(split_res[:-1]).strip().replace('/', '\\/')
    data_dict = dict([x.split('=') for x in data_check_string.split('\n')])
    return int(data_dict['auth_date'])


async def check_energy(pg: asyncpg.Connection, user_id: int, amount: int, _token: str) -> Tuple[int, int]:
    _energy = await _get_refresh_energy(pg, user_id, _token)
    if _energy == 0:
        return 0, 0
    return await decr_energy(pg, user_id, amount)


async def get_energy(pg: asyncpg.Connection, user_id: int, _token: str) -> int:
    return await _get_refresh_energy(pg, user_id, _token)
