import sys
import asyncio
from app.src.db.pg import migrate


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise RuntimeError('you need to specify target revision')
    asyncio.run(migrate(sys.argv[1]))
