import asyncio
import aio_pika
from starlette.requests import Request
from aio_pika.abc import AbstractRobustConnection

from ..config import RMQ_HOST, RMQ_PORT, RMQ_USER, RMQ_PASSWORD


fqdn = f'amqp://{RMQ_USER}:{str(RMQ_PASSWORD)}@{RMQ_HOST}:{RMQ_PORT}/'

async def get_connection() -> AbstractRobustConnection:
    while True:
        try:
            conn = await aio_pika.connect_robust(fqdn)
            return conn
        except ConnectionError:
            await asyncio.sleep(2)


async def get_channel(conn_pool: AbstractRobustConnection) -> aio_pika.Channel:
    async with conn_pool.acquire() as connection:
        return await connection.channel()


async def get_rmq(request: Request) -> aio_pika.Channel:
    async with request.app.state.rmq_chan_pool.acquire() as chan:
        yield chan

