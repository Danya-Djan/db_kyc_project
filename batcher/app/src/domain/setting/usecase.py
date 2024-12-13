import decimal
import threading
import asyncio
from collections.abc import Callable, Awaitable
import aio_pika

from .repos.in_memory_storage import set_setting, get_setting as ims_get_setting
from .repos.rmq import consume_setting_updates



def get_setting(name: str) -> decimal.Decimal:
    return ims_get_setting(name)

async def start_thread(rmq_connect_func: Callable[[], Awaitable[aio_pika.abc.AbstractRobustConnection]], *args):
    conn = await rmq_connect_func()
    async with conn:
        chan = await conn.channel()
        await consume_setting_updates(set_setting, chan)


def launch_consumer(rmq_connect_func: Callable[[], Awaitable[aio_pika.abc.AbstractRobustConnection]]):
    t = threading.Thread(target=asyncio.run, args=(start_thread(rmq_connect_func),))
    t.start()
