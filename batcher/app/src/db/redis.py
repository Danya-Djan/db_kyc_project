from starlette.requests import Request
import redis.asyncio as redis

from ..config import REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_DB


def connect_redis() -> redis.ConnectionPool:
    return redis.ConnectionPool(host=REDIS_HOST, port=REDIS_PORT, username=REDIS_USER, password=str(REDIS_PASSWORD), db=REDIS_DB)


async def get_redis(request: Request) -> redis.Redis:
    r = redis.Redis(connection_pool=request.app.state.redis_pool)
    yield r
    await r.aclose()
