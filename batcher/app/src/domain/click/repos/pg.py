from datetime import datetime, timedelta
import decimal
from asyncpg import Connection

from ..models import Click


async def update_click_expiry(conn: Connection, user_id: int, period: int) -> decimal.Decimal:
    cur_time = datetime.now()
    cutoff_time = cur_time - timedelta(hours=period)
    query = '''
        WITH expired_values AS(
            UPDATE clicks
            SET expiry_info=jsonb_set(expiry_info, $1, 'true')
            WHERE 1=1
                AND time < $2
                AND user_id =$3
                AND not (expiry_info->>$4)::bool
            RETURNING value
        )
        SELECT COALESCE(SUM(value), 0)
        FROM expired_values
        ;
    '''
    period_key = f'period_{period}'
    return await conn.fetchval(query, [period_key], cutoff_time, user_id, period_key)


async def store(conn: Connection, click: Click) -> int:
    query = '''
        INSERT INTO clicks(user_id, time, value, expiry_info)
        VALUES($1, $2, $3, '{"period_24": false, "period_168": false}')
        RETURNING id
        ;
    '''
    return await conn.fetchval(query, click.userId, click.dateTime, click.value)


async def bulk_store_copy(conn: Connection, click: Click, count: int) -> None:
    args = [(click.userId, click.dateTime, click.value) for _ in range(count)]
    query = '''
        INSERT INTO clicks(user_id, time, value, expiry_info)
        VALUES($1, $2, $3, '{"period_24": false, "period_168": false}')
        ;
    '''
    await conn.executemany(query, args)


async def delete_by_user_id(conn: Connection, user_id: int):
    await conn.execute('DELETE FROM clicks WHERE user_id=$1', user_id)
