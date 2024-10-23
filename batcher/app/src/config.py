from starlette.config import Config
from starlette.datastructures import Secret
from functools import lru_cache

config = Config('.env')


REDIS_USER = config('REDIS_USER')
REDIS_PASSWORD = config('REDIS_PASSWORD', cast=Secret)
REDIS_PORT = config('REDIS_PORT', cast=int)
REDIS_HOST = config('REDIS_HOST')
REDIS_DB = config('REDIS_DB')

HTTP_PORT = config('HTTP_PORT', cast=int)

PG_HOST = config('POSTGRES_HOST')
PG_PORT = config('POSTGRES_PORT', cast=int)
PG_USER = config('POSTGRES_USER')
PG_PASSWORD = config('POSTGRES_PASSWORD', cast=Secret)
PG_DB = config('POSTGRES_DB')

RMQ_HOST = config('RABBITMQ_HOST')
RMQ_PORT = config('RABBITMQ_PORT', cast=int)
RMQ_USER = config('RABBITMQ_DEFAULT_USER')
RMQ_PASSWORD = config('RABBITMQ_DEFAULT_PASSWORD', cast=Secret)

TG_TOKEN = config('TG_TOKEN', cast=Secret)

BACKEND_URL = config('BACKEND_URL', default='http://backend:8000')
