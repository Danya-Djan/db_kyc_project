import decimal
import json
import aio_pika
from typing import Callable
import asyncpg

SETTING_QUEUE_NAME = "settings"


async def consume_setting_updates(pg_pool: asyncpg.Pool, set_setting_func: Callable[[str, decimal.Decimal], None], chan: aio_pika.abc.AbstractChannel):
    queue = await chan.declare_queue(SETTING_QUEUE_NAME, durable=True)

    async with queue.iterator() as queue_iter:
        async for msg in queue_iter:
            async with msg.process():
                settings = json.loads(msg.body.decode('utf-8'))
                async with pg_pool.acquire() as pg_conn:
                    for name, value in settings.items():
                        await set_setting_func(pg_conn, name, decimal.Decimal(value))
