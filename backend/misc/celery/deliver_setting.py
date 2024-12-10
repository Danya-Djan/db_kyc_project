from kombu import Connection, Producer, Queue
from django.conf import settings
from clicker.celery import app
from misc.models import Setting


@app.task(autoretry_for=(Exception,), retry_backoff=True)
def deliver_setting(setting_name):
    setting = Setting.objects.get(name=setting_name)
    rabbitmq_conf = settings.RABBITMQ
    dsn = f'{rabbitmq_conf["PROTOCOL"]}://{rabbitmq_conf["USER"]}:{rabbitmq_conf["PASSWORD"]}@{rabbitmq_conf["HOST"]}:{rabbitmq_conf["PORT"]}/'
    queue = Queue(settings.SETTINGS_QUEUE_NAME, exchange='', routing_key=settings.SETTINGS_QUEUE_NAME)
    with Connection(dsn) as conn:
        with conn.channel() as channel:
            producer = Producer(channel)
            producer.publish(
                {setting.name: setting.value['value']},
                exchange='',
                routing_key=settings.SETTINGS_QUEUE_NAME,
                declare=[queue]
            )

