import asyncio

from aiogram import Bot, Dispatcher, types
from keyboards import *
from aiogram.dispatcher.filters import Text
import re
import os
import time
import shutil
import random
from create_bot import bot, request_url, important_message, url, token, bucket_name, username, password, endpoint_url
from req import check_register
import urllib.request
from messages import get_main_menu_message
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from loguru import logger


def download_image(url, new_filename):
    try:
        urllib.request.urlretrieve(url, new_filename)
        print("Image downloaded successfully as:", new_filename)
    except Exception as e:
        print("An error occurred:", str(e))
        
def copy_and_rename_image(source_folder, image_name, destination_folder, new_image_name):
    # Check if the source image exists
    if not os.path.exists(os.path.join(source_folder, image_name)):
        print(f"Image '{image_name}' does not exist in the source folder.")
        return
    
    # Create the destination folder if it doesn't exist
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    
    # Construct source and destination paths
    source_path = os.path.join(source_folder, image_name)
    destination_path = os.path.join(destination_folder, new_image_name)
    
    try:
        # Copy the image file
        shutil.copy(source_path, destination_path)
        print(f"Successfully copied '{image_name}' to '{destination_path}'.")
    except Exception as e:
        print(f"Error copying image: {e}")

def get_answer_keyboard():
    keyboard = InlineKeyboardMarkup()
    button1 = InlineKeyboardButton('Главное меню', callback_data='main_menu')
    keyboard.add(button1)
    return keyboard

def get_main_keyboard_inline(is_admin=False, ref_code=None):
    keyboard = InlineKeyboardMarkup()
    button1 = InlineKeyboardButton('👾 Кликер', web_app=WebAppInfo(url=f'{url}?referred_by={ref_code}'))
    button2 = InlineKeyboardButton('ℹ️ Инструкция', callback_data='instruction_inline')
    # button3 = InlineKeyboardButton('🔥 Кто мы?', web_app=WebAppInfo(url=''))
    button4 = InlineKeyboardButton('ТЕСТ', callback_data='test_message')
    keyboard.add(button1)
    keyboard.add(button2)
    # keyboard.add(button3)
    if is_admin:
        keyboard.add(button4)
    return keyboard

async def get_main_menu_answer(call: types.CallbackQuery):
    logger.info(f"{call.from_user.id} - @{call.from_user.username} : главное меню через инлайн кнопку")
    await call.message.edit_text(get_main_menu_message(), reply_markup=get_main_keyboard_inline(), parse_mode=types.ParseMode.MARKDOWN)
    
async def get_main_menu_after_picture(call: types.CallbackQuery):
    logger.info(f"{call.from_user.id} - @{call.from_user.username} : главное меню через инлайн кнопку после картинки")
    await call.message.delete()
    await bot.send_message(call.from_user.id, get_main_menu_message(), reply_markup=get_main_keyboard_inline(), parse_mode=types.ParseMode.MARKDOWN)
    
# async def get_main_menu(call: types.CallbackQuery):
#     logger.info(f"{call.from_user.id} - @{call.from_user.username} : главное меню через инлайн кнопку без фото")
#     call.message.delete()
#     await bot.send_photo(call.from_user.id, open('pictures/main_menu.jpg', 'rb'), caption=f"{get_main_message(call.from_user.id)}", reply_markup=get_main_keyboard_inline(check_admin(call.from_user.id)), parse_mode=types.ParseMode.MARKDOWN)

async def command_start(message : types.Message, state:FSMContext):
    ref_code = ''
    if message.text[7:].startswith('user_'):
        ref_code = message.text[12:]  
    if not check_register(message.from_user.id):
        user = message.from_user
        # try:
        #     photos = await bot.get_user_profile_photos(user.id)
        #     photo = photos.photos[0][-1]
        #     file_info = await bot.get_file(photo.file_id)
        #     download_image(f'https://api.telegram.org/file/bot{token}/{file_info["file_path"]}', f'photos/{user.id}.jpg')
        # except:
        #     copy_and_rename_image('.', 'avatar.jpg', 'photos', f'{user.id}.jpg')
        
        image_path = f'photos/{user.id}.jpg'
        s3_key = f'{user.id}.jpg'
        # upload_image_to_s3(image_path, bucket_name, s3_key, username, password, endpoint_url)
        
        logger.info(f"{message.from_user.id} - @{message.from_user.username} : команда /start и не зарегистрирован")
        await bot.send_message(message.from_user.id, '👋', reply_markup=ReplyKeyboardRemove())
        await asyncio.sleep(0.5)
        await bot.send_message(message.from_user.id, '👑 Я - KYC Кликер бот! Зарабатывай баллы кликами, поднимайся в рейтинге и получай бонусы. Развивайся быстрее с нашей специальной системой для новичков!', reply_markup=ReplyKeyboardRemove())
        await asyncio.sleep(0.5)
        await bot.send_message(message.from_user.id, '🎁 Используй баллы в аукционе за ценные призы! Победителей много, приглашаем в увлекательную битву кликов!', reply_markup=ReplyKeyboardRemove())
        await asyncio.sleep(0.5)
        await bot.send_message(message.from_user.id, '👯 Участвуй в реферальной программе, чтобы получать % с кликов друзей и зарабатывать больше баллов для аукциона. ', reply_markup=ReplyKeyboardRemove())
        await asyncio.sleep(0.5)
        await bot.send_message(message.from_user.id, '🍀 Удачи в битве!', reply_markup=ReplyKeyboardRemove())
        await asyncio.sleep(0.5)
    else:
        logger.info(f"{message.from_user.id} - @{message.from_user.username} : команда /start")
        
    await bot.send_message(message.from_user.id, get_main_menu_message(), reply_markup=get_main_keyboard_inline(ref_code=ref_code), parse_mode=types.ParseMode.MARKDOWN)