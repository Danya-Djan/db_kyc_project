from aiogram import Bot, Dispatcher, Router, types
from aiogram.fsm.storage.memory import MemoryStorage
from create_bot import bot, WEBHOOK_URL
from handlers.register_handlers import register_all_handlers
from loguru import logger

dp = Dispatcher(storage=MemoryStorage())

logger.add("logs.log", format = "{time} | {module} : {function} | {level} | {message}", level = "INFO", rotation = "1 week", compression = "zip")#, serialize = True)


async def on_startup():
    webhook_info = await bot.get_webhook_info()
    if webhook_info.url != WEBHOOK_URL:
        await bot.set_webhook(
            url=WEBHOOK_URL,
            drop_pending_updates=True
        )

    router = Router()
    register_all_handlers(router)
    dp.include_router(router)


async def on_shutdown():
    await bot.session.close()
    await bot.delete_webhook()
