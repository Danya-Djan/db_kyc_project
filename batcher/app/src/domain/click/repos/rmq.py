import json
import kombu
import uuid

from ..models import Click


CELERY_QUEUE_NAME = "celery"
SETTING_QUEUE_NAME = "settings"
CLICK_TASK_NAME = "clicks.celery.click.handle_click"
SETTING_TASK_NAME = "misc.celery.deliver_setting.deliver_setting"


def send_click_batch_copy(conn: kombu.Connection, click: Click, count: int):
    producer = kombu.Producer(conn)
    producer.publish(
        json.dumps({
            'id': str(uuid.uuid4()),
            'task': CLICK_TASK_NAME,
            'args': [click.UserID, int(click.DateTime.timestamp() * 1e3), str(click.Value), count],
            'kwargs': dict(),
        }),
        routing_key=CELERY_QUEUE_NAME,
        delivery_mode='persistent',
        mandatory=False,
        immediate=False,
        content_type='application/json',
        serializer='json',
    )
