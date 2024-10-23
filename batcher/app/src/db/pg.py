import asyncpg
import asyncio

from ..config import PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB


DB_URL = f'postgresql://{PG_USER}:{str(PG_PASSWORD)}@{PG_HOST}:{PG_PORT}/{PG_DB}'


async def connect_db() -> asyncpg.Pool:
    return await asyncpg.create_pool(DB_URL)


pool = asyncio.run(connect_db())


async def get_pg() -> asyncpg.Connection:
    async with pool.acquire() as conn:
        yield conn