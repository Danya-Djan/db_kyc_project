import decimal
import threading

_settings = dict()
mx = threading.Lock()


def get_setting(name: str) -> decimal.Decimal:
    try:
        mx.acquire()
        return _settings[name]
    finally:
        mx.release()


def set_setting(name: str, value: decimal.Decimal):
    try:
        mx.acquire()
        _settings[name] = value
    finally:
        mx.release()
