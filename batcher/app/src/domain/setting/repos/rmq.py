import decimal
import json

import aio_pika
from typing import Callable


SETTING_QUEUE_NAME = "settings"
SETTING_TASK_NAME = "misc.celery.deliver_setting.deliver_setting"


async def consume_setting_updates(update_setting_func: Callable[[str, decimal.Decimal], None], chan: aio_pika.Channel):
    queue = await chan.get_queue(SETTING_QUEUE_NAME)

    async with queue.iterator() as queue_iter:
        async for msg in queue_iter:
            async with msg.process():
                settings = json.loads(msg.body.decode('utf-8'))
                for name, value in settings.items():
                    update_setting_func(name, value)
