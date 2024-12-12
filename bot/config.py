import logging
from aiogram import Bot, types
from aiogram import Dispatcher
from create_bot import bot, token, WEBHOOK_URL
from handlers.register_handlers import register_all_handlers
from aiogram.fsm.storage.memory import MemoryStorage
from loguru import logger

dp = Dispatcher(bot, storage=MemoryStorage())

logger.add("logs.log", format = "{time} | {module} : {function} | {level} | {message}", level = "INFO", rotation = "1 week", compression = "zip")#, serialize = True)


async def on_startup():
    webhook_info = await bot.get_webhook_info()
    if webhook_info.url != WEBHOOK_URL:
        await bot.set_webhook(
            url=WEBHOOK_URL,
            drop_pending_updates=True
        )

    register_all_handlers(dp)


async def on_shutdown():
    await bot.session.close()
    await bot.delete_webhook()
