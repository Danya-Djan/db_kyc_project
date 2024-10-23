import decimal
import threading

import aio_pika

from .repos.in_memory_storage import get_setting as ims_get_setting
from .repos.rmq import consume_setting_updates


def get_setting(name: str) -> decimal.Decimal:
    return ims_get_setting(name)


def launch_consumer(rmq: aio_pika.Connection):
    t = threading.Thread(target=consume_setting_updates, args=(ims_get_setting, rmq))
    t.start()
