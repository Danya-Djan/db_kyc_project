import decimal
import json
import aio_pika
from typing import Callable


SETTING_QUEUE_NAME = "settings"

async def consume_setting_updates(set_setting_func: Callable[[str, decimal.Decimal], None], chan: aio_pika.abc.AbstractChannel):
    queue = await chan.declare_queue(SETTING_QUEUE_NAME)

    async with queue.iterator() as queue_iter:
        async for msg in queue_iter:
            async with msg.process():
                settings = json.loads(msg.body.decode('utf-8'))
                for name, value in settings.items():
                    set_setting_func(name, decimal.Decimal(value))
