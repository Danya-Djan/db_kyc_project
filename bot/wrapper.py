from handlers.register_handlers import register_all_handlers
from create_bot import bot
from aiogram import Bot, Dispatcher
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from loguru import logger

logger.add("logs.log", format = "{time} | {module} : {function} | {level} | {message}", level = "INFO", rotation = "1 week", compression = "zip")#, serialize = True)

async def run_bot():

    dp = Dispatcher(bot, storage=MemoryStorage())

    register_all_handlers(dp)

    await dp.skip_updates()
    await dp.start_polling()