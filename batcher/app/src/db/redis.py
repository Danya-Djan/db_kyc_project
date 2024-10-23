import asyncio
import redis.asyncio as redis

from ..config import REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_DB


r = asyncio.run(redis.Redis(host=REDIS_HOST, port=REDIS_PORT, username=REDIS_USER, password=REDIS_PASSWORD, db=REDIS_DB))


def get_redis() -> redis.Redis:
    yield r
