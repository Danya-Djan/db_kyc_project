import decimal
import threading
import asyncio
from collections.abc import Callable, Awaitable
import aio_pika
import asyncpg

from .repos.pg import set_setting, get_setting as pg_get_setting
from .repos.rmq import consume_setting_updates



def get_setting(pg: asyncpg.Connection, name: str) -> decimal.Decimal:
    return pg_get_setting(pg, name)


async def start_thread(connect_pg: Callable[[], Awaitable[asyncpg.Pool]], rmq_connect_func: Callable[[], Awaitable[aio_pika.abc.AbstractRobustConnection]], *args):
    pg_pool = await connect_pg()
    conn = await rmq_connect_func()
    try:
        async with conn:
            chan = await conn.channel()
            await consume_setting_updates(pg_pool, set_setting, chan)
    finally:
        await pg_pool.close()
    

def launch_consumer(connect_pg: Callable[[], Awaitable[asyncpg.Pool]], rmq_connect_func: Callable[[], Awaitable[aio_pika.abc.AbstractRobustConnection]]):
    t = threading.Thread(target=asyncio.run, args=(start_thread(connect_pg, rmq_connect_func),))
    t.start()
