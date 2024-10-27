from handlers.register_handlers import register_all_handlers
from create_bot import bot
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from loguru import logger
from aiogram import Router

logger.add("logs.log", format = "{time} | {module} : {function} | {level} | {message}", level = "INFO", rotation = "1 week", compression = "zip")#, serialize = True)

async def run_bot():
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    # Create a router to register handlers
    router = Router()
    
    # Register all handlers
    register_all_handlers(router)

    # Mount the router into the dispatcher
    dp.include_router(router)

    await dp.start_polling(bot)