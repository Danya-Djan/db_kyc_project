import asyncio

from app.src.config import PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB
from pathlib import Path
from starlette.requests import Request
import asyncpg
import logging
from asyncpg_trek import plan, execute, Direction
from asyncpg_trek.asyncpg import AsyncpgBackend


DB_URL = f'postgresql://{PG_USER}:{str(PG_PASSWORD)}@{PG_HOST}:{PG_PORT}/{PG_DB}'
MIGRATIONS_DIR = Path(__file__).parent.resolve() / "migrations"

logger = logging.getLogger("uvicorn")

async def connect_pg() -> asyncpg.Pool:
    while True:
        try:
            logger.info(DB_URL)
            pg_conn =  await asyncpg.create_pool(DB_URL)
            return pg_conn
        except OSError:
            logger.info("Postgres is unavailable - sleeping")
            await asyncio.sleep(2)


async def get_pg(request: Request) -> asyncpg.Connection:
    async with request.app.state.pg_pool.acquire() as conn:
        yield conn


async def migrate(
    target_revision: str,
) -> None:
    pool = await connect_pg()
    async with pool.acquire() as conn:
        backend = AsyncpgBackend(conn)
        planned = await plan(backend, MIGRATIONS_DIR, target_revision=target_revision, direction=Direction.up)
        await execute(backend, planned)
