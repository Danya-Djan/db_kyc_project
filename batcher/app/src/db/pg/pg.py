from batcher.app.src.config import PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB
from pathlib import Path
import asyncio
import asyncpg
from asyncpg_trek import plan, execute, Direction
from asyncpg_trek.asyncpg import AsyncpgBackend


DB_URL = f'postgresql://{PG_USER}:{str(PG_PASSWORD)}@{PG_HOST}:{PG_PORT}/{PG_DB}'
MIGRATIONS_DIR = Path(__file__) / "migrations"


async def connect_db() -> asyncpg.Pool:
    return await asyncpg.create_pool(DB_URL)


pool = asyncio.run(connect_db())


async def get_pg() -> asyncpg.Connection:
    async with pool.acquire() as conn:
        yield conn


async def migrate(
        target_revision: str,
) -> None:
    async with pool.acquire() as conn:
        backend = AsyncpgBackend(conn)
        async with backend.connect() as conn:
            planned = await plan(conn, backend, MIGRATIONS_DIR, target_revision=target_revision, direction=Direction.up)
            await execute(conn, backend, planned)
