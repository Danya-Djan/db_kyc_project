from fastapi import APIRouter
from aiogram import types, Dispatcher, Bot
from create_bot import bot, token
from config import dp


bot_api_router = APIRouter(
    prefix=f'/bot/wh',
)


@bot_api_router.post(f'/{token}', include_in_schema=False)
async def bot_webhook(update: dict):
    telegram_update = types.Update(**update)
    Dispatcher.set_current(dp)
    Bot.set_current(bot)
    await dp.process_update(telegram_update)
