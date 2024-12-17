from aiogram import types
from keyboards import kb_main
from aiogram import Bot, Dispatcher
import re
import json
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from create_bot import bot, important_message, event_number
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.exceptions import MessageToDeleteNotFound
from dbm_defs import add_rec, get_rec

from loguru import logger

def get_event_keyboard(number):
    dlina = 5
    keyboard = InlineKeyboardMarkup()
    button3 = InlineKeyboardButton('←', callback_data="num_decr")
    button4 = InlineKeyboardButton(f'{number + 1}/{dlina}', callback_data="element")
    button5 = InlineKeyboardButton('→', callback_data="num_incr")
    button6 = InlineKeyboardButton('Главное меню', callback_data='main_menu_delete')
    if int(number + 1) == 1:
        keyboard.add(button4, button5)
    elif int(number + 1) == dlina:
        keyboard.add(button3, button4)
    else:
        keyboard.add(button3, button4, button5)
    keyboard.add(button6)
    return keyboard



ins_list = ['1.png',
            '2.png',
            '3.png',
            '4.png',
            '5.png']

async def instruction_message(call: types.CallbackQuery):
    add_rec(call.from_user.id, 0)
    # await call.message.delete()
    await bot.send_photo(call.from_user.id, open('pictures/1.png', 'rb'), reply_markup=get_event_keyboard(0), parse_mode=types.ParseMode.MARKDOWN)
        
async def update_instruction(message: types.Message, new_value: int):
    # print(ins_list[event_number.get(message.from_user.id, 0)])
    await message.edit_media(types.InputMediaPhoto(open(f'pictures/{new_value + 1}.png', 'rb'), parse_mode=types.ParseMode.MARKDOWN), reply_markup=get_event_keyboard(new_value))
    
async def callbacks_instruction(callback: types.CallbackQuery):
    user_value = int(get_rec(callback.from_user.id))
    action = callback.data.split("_")[1]

    if action == "incr":
        if len(ins_list) > user_value + 1:
            add_rec(callback.from_user.id, user_value + 1)
            await update_instruction(callback.message, user_value + 1)
    elif action == "decr":
        if user_value - 1 >= 0:
            add_rec(callback.from_user.id, user_value - 1)
            await update_instruction(callback.message, user_value - 1)
        
    await callback.answer()
