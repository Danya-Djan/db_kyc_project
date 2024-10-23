import aio_pika
from aio_pika.abc import AbstractRobustConnection
import asyncio

from ..config import RMQ_HOST, RMQ_PORT, RMQ_USER, RMQ_PASSWORD


async def get_connection() -> AbstractRobustConnection:
    return await aio_pika.connect_robust(f'amqp://{RMQ_USER}:{RMQ_PASSWORD}@{RMQ_HOST}:{RMQ_PORT}/')


conn_pool = aio_pika.pool.Pool(get_connection, max_size=2)


async def get_channel() -> aio_pika.Channel:
    async with conn_pool.acquire() as connection:
        return await connection.channel()


chan_pool = aio_pika.pool.Pool(get_channel, max_size=10)


async def get_rmq() -> aio_pika.Channel:
    async with chan_pool.acquire() as chan:
        yield chan

