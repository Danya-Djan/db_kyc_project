from decimal import Decimal
from asyncpg import Connection


async def get_setting(conn: Connection, name: str) -> Decimal:
    return await conn.fetchval('SELECT value FROM settings WHERE name=$1', name)


async def set_setting(conn: Connection, name: str, value: Decimal):
    query = '''
        INSERT INTO settings (name, value)
            VALUES ($1, $2)
        ON CONFLICT(name) DO UPDATE
            SET value=$2
    '''
    await conn.execute(query, name, value)