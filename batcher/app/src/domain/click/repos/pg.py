from typing import Tuple
import decimal
from asyncpg import Connection

from ..models import Click


async def store(conn: Connection, click: Click) -> int:
    query = '''
        INSERT INTO clicks(user_id, time, value, count)
        VALUES($1, $2, $3, $4)
        RETURNING id
        ;
    '''
    return await conn.fetchval(query, click.userId, click.dateTime, click.value, click.count)


async def delete_user_info(conn: Connection, user_id: int):
    async with conn.transaction():
        await conn.execute('DELETE FROM clicks WHERE user_id=$1', user_id)
        await conn.execute('DELTE FROM users WHERE id=$1', user_id)


async def get_period_sum(conn: Connection, user_id: int, period: int) -> decimal.Decimal:
    if not isinstance(period, int):
        raise ValueError('period must be an integer')
    return (await conn.fetchval(f'SELECT period_{period} FROM coefficients WHERE user_id=$1', user_id)) or decimal.Decimal(0)


async def get_max_period_sum(conn: Connection, period: int) -> decimal.Decimal:
    if not isinstance(period, int):
        raise ValueError('period must be an integer')
    return (await conn.fetchval(f'SELECT max_period_{period} FROM global_stat')) or decimal.Decimal(0)


async def get_global_average(conn: Connection) -> decimal.Decimal:
    return (await conn.fetchval('SELECT global_average FROM global_stat')) or decimal.Decimal(0)


async def get_user_total(conn: Connection, user_id: int) -> decimal.Decimal:
    return (await conn.fetchval('SELECT total FROM coefficients WHERE user_id=$1', user_id)) or decimal.Decimal(0)


async def user_exists(conn: Connection, user_id: int) -> bool:
    return await conn.fetchval('SELECT EXISTS(SELECT 1 FROM users WHERE id=$1)', user_id)\


async def add_user(conn: Connection, user_id: int, req_token: str, session_energy: int):
    await conn.execute(
        'INSERT INTO users (id, session, energy) VALUES ($1, $2, $3)',
        user_id, req_token, session_energy
    )


async def get_user_session(conn: Connection, user_id: int) -> str:
    return await conn.fetchval('SELECT session FROM users WHERE id=$1', user_id)


async def set_new_session(conn: Connection, user_id: int, req_token: str, session_energy: int):
    await conn.execute('UPDATE users SET session=$1, energy=$2 WHERE id=$3', req_token, session_energy, user_id)


async def get_energy(conn: Connection, user_id: int) -> int:
    return await conn.fetchval('SELECT energy FROM users WHERE id=$1', user_id)


async def decr_energy(conn: Connection, user_id: int, amount: int) -> Tuple[int, int]:
    new_energy, spent = await conn.fetchrow('''
        WITH energy_cte AS (
            SELECT energy, (CASE WHEN energy < $2 THEN energy ELSE $2 END) AS delta FROM users WHERE id=$1
        )
        UPDATE users AS u SET
            energy=u.energy - e.delta
        FROM energy_cte AS e
        WHERE id=$1
        RETURNING u.energy as new_energy, e.delta
    ''', user_id, amount)
    return new_energy, spent