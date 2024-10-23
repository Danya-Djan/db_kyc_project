import json
import aio_pika
import uuid

from ..models import Click


CELERY_QUEUE_NAME = "celery"
CLICK_TASK_NAME = "clicks.celery.click.handle_click"


def send_click_batch_copy(chan: aio_pika.Channel, click: Click, count: int):
    await chan.default_exchange.publish(
        message=aio_pika.Message(json.dumps({
            'id': str(uuid.uuid4()),
            'task': CLICK_TASK_NAME,
            'args': [click.UserID, int(click.DateTime.timestamp() * 1e3), str(click.Value), count],
            'kwargs': dict(),
        }).encode('utf-8')),
        routing_key=CELERY_QUEUE_NAME,
        mandatory=False,
    )
