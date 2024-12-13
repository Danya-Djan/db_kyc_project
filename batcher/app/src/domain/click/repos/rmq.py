import json
import aio_pika
import uuid
from datetime import datetime

from ..models import Click


CELERY_QUEUE_NAME = "celery"
CLICK_TASK_NAME = "clicks.celery.click.handle_click"


async def send_click_batch_copy(chan: aio_pika.Channel, click: Click, count: int):
    args = (click.userId, int(click.dateTime.timestamp() * 1e3), str(click.value), count)
    await chan.default_exchange.publish(
        message=aio_pika.Message(
            body=json.dumps([
                args,
                {},
                {"callbacks": None, "errbacks": None, "chain": None, "chord": None},
            ]).encode('utf-8'),
            headers={
                'task': CLICK_TASK_NAME,
                'lang': 'py',
                'argsrepr': repr(args),
                'kwargsrepr': '{}',
                'id': str(uuid.uuid4()),
                'eta': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                'retries': 0,
            },
            content_type='application/json',
            content_encoding='utf-8',
        ),
        routing_key=CELERY_QUEUE_NAME,
        mandatory=False,
        immediate=False,
    )
