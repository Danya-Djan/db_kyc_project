import asyncio
from loguru import logger
from wrapper import run_bot

def main():
    try:
        logger.info("Starting bot")
        asyncio.run(run_bot())
    except KeyboardInterrupt:
        logger.info("Interrupted by user, shutting down")
        return

if __name__ == "__main__":
    main()

