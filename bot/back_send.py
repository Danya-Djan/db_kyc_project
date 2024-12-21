import json
import io
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from create_bot import bot, important_message, url
from aiogram import types
from create_bot import request_url, api_token
import requests
import time
import re
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, ReplyKeyboardRemove
from loguru import logger

def get_answer_keyboard():
    keyboard = InlineKeyboardMarkup()
    button1 = InlineKeyboardButton('Главное меню', callback_data='main_menu_text')
    keyboard.add(button1)
    return keyboard
    
class AlertSchema(BaseModel):
    tg_id: int
    message: str
    
class DispatchSchema(BaseModel):
    tg_id: int
    text: str
    attachment_path: str
    button_name: str | None = None
    button_url: str | None = None
    web_app_button_name: str | None = None
    
send_message_router = APIRouter(
    prefix=''
)

@send_message_router.post('/dispatch/')
async def handle_dispatch(data: DispatchSchema, background_tasks: BackgroundTasks):
    try:
        await bot.send_message(data.tg_id, data.text)
        # media = io.BytesIO(requests.get(data.attachment_path).content)
        # media.seek(0)
        # attachment = types.InputFile(media)
        # keyboard = InlineKeyboardMarkup()
        # if data.button_name and data.button_url:
        #     button1 = InlineKeyboardButton(f'{data.button_name}', url=f"{data.button_url}")
        #     keyboard.add(button1)
        # if data.web_app_button_name:
        #     button2 = InlineKeyboardButton(f'{data.web_app_button_name}', web_app=WebAppInfo(url=f"{url}"))
        #     keyboard.add(button2)
        
        # if not data.button_name and not data.web_app_button_name:
        #     await bot.send_photo(data.tg_id, attachment, caption=data.text, parse_mode=types.ParseMode.MARKDOWN, reply_markup=ReplyKeyboardRemove())
        # else:
        #     await bot.send_photo(data.tg_id, attachment, caption=data.text, reply_markup=keyboard, parse_mode=types.ParseMode.MARKDOWN)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {'ok': True}

@send_message_router.post('/alert/')
async def handle_alert(data: AlertSchema):
    try:
        await bot.send_message(chat_id=data.tg_id, text=data.message, parse_mode=types.ParseMode.MARKDOWN) #, reply_markup=get_answer_keyboard())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {'ok': True}