import asyncio
from aiogram import Bot, Dispatcher, types
import re
import os
import time
import shutil
import random
from create_bot import bot, request_url, important_message, url, token, bucket_name, username, password, endpoint_url
from req import check_register
import urllib.request
from messages import get_main_menu_message
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.enums import ParseMode
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from loguru import logger

import boto3
from botocore.config import Config

def get_answer_keyboard():
    button1 = InlineKeyboardButton(text='Главное меню', callback_data='main_menu')
    kb = [[button1]]
    keyboard = InlineKeyboardMarkup(inline_keyboard=kb)
    return keyboard

def get_main_keyboard_inline(is_admin=False, ref_code=None):
    button1 = InlineKeyboardButton(text='👾 Кликер', web_app=WebAppInfo(url=f'{url}?referred_by={ref_code}'))
    button2 = InlineKeyboardButton(text='ℹ️ Инструкция', callback_data='instruction_inline')
    button3 = InlineKeyboardButton(text='🔥 Кто мы?', web_app=WebAppInfo(url='https://test.com'))
    button4 = InlineKeyboardButton(text='ТЕСТ', callback_data='test_message')
    kb = [[button1], [button2], [button3]]
    if is_admin:
        kb.append([button4])
    keyboard = InlineKeyboardMarkup(inline_keyboard=kb)
    return keyboard

def gen_ok_keyboard(number):
    kb = [[InlineKeyboardButton(text='Подтвердить ✅', callback_data=f'approve_{number}'), InlineKeyboardButton(text='Изменить 🔄', callback_data=f'edit_{number}')]]
    keyboard = InlineKeyboardMarkup(inline_keyboard=kb)
    return keyboard

async def get_main_menu_answer(call: types.CallbackQuery):
    logger.info(f"{call.from_user.id} - @{call.from_user.username} : главное меню через инлайн кнопку")
    await call.message.edit_text(get_main_menu_message(), reply_markup=get_main_keyboard_inline(), parse_mode=ParseMode.MARKDOWN)
    
async def get_main_menu_after_picture(call: types.CallbackQuery):
    logger.info(f"{call.from_user.id} - @{call.from_user.username} : главное меню через инлайн кнопку после картинки")
    await call.message.delete()
    await bot.send_message(call.from_user.id, get_main_menu_message(), reply_markup=get_main_keyboard_inline(), parse_mode=ParseMode.MARKDOWN)

async def command_start(message : types.Message):
    ref_code = ''
    if message.text[7:].startswith('user_'):
        ref_code = message.text[12:]  
    if not check_register(message.from_user.id):
        
        logger.info(f"{message.from_user.id} - @{message.from_user.username} : команда /start и не зарегистрирован")
        await bot.send_message(message.from_user.id, '👋', reply_markup=ReplyKeyboardRemove())
        # await asyncio.sleep(3)
        await bot.send_message(message.from_user.id, '👑 Я - KYC Кликер бот! Зарабатывай баллы кликами, поднимайся в рейтинге и получай бонусы. Развивайся быстрее с нашей специальной системой для новичков!', reply_markup=ReplyKeyboardRemove())
        # await asyncio.sleep(3)
        await bot.send_message(message.from_user.id, '🎁 Используй баллы в аукционе за ценные призы! Победителей много, приглашаем в увлекательную битву кликов!', reply_markup=ReplyKeyboardRemove())
        # await asyncio.sleep(3)
        await bot.send_message(message.from_user.id, '👯 Участвуй в реферальной программе, чтобы получать % с кликов друзей и зарабатывать больше баллов для аукциона. ', reply_markup=ReplyKeyboardRemove())
        # await asyncio.sleep(3)
        await bot.send_message(message.from_user.id, '🍀 Удачи в битве!', reply_markup=ReplyKeyboardRemove())
        # await asyncio.sleep(3)
    else:
        logger.info(f"{message.from_user.id} - @{message.from_user.username} : команда /start")
        
    await bot.send_message(message.from_user.id, get_main_menu_message(), reply_markup=get_main_keyboard_inline(ref_code=ref_code), parse_mode=ParseMode.MARKDOWN)