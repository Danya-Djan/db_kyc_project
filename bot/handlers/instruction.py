from aiogram import types
from aiogram import Bot, Dispatcher
import re
import json
from create_bot import bot, important_message, event_number
from memcached_def import add_rec, get_rec
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup, InlineKeyboardButton, FSInputFile

from loguru import logger

def get_event_keyboard(number):
    kb = []
    dlina = 5
    button1 = InlineKeyboardButton(text='←', callback_data="num_decr")
    button2 = InlineKeyboardButton(text=f'{number + 1}/{dlina}', callback_data="element")
    button3 = InlineKeyboardButton(text='→', callback_data="num_incr")
    button4 = InlineKeyboardButton(text='Главное меню', callback_data='main_menu_delete')
    if int(number + 1) == 1:
        kb = [[button2, button3]]
    elif int(number + 1) == dlina:
        kb = [[button1, button2]]
    else:
        kb = [[button1, button2, button3]]
    kb.append([button4])
    keyboard = InlineKeyboardMarkup(inline_keyboard=kb)
    return keyboard

def read_data_from_file(file_path):
    try:
        with open(file_path, 'r') as file:
            data_lines = file.readlines()
        
        data_dict = {}
        for line in data_lines:
            key, value = line.strip().split(": ")
            data_dict[key.strip()] = value.strip()
        
        return data_dict
    except FileNotFoundError:
        print("File not found.")
        return None
    except Exception as e:
        print("An error occurred:", e)
        return None

def update_file(file_path, data_dict):
    try:
        with open(file_path, 'r') as file:
            existing_data = file.readlines()
        
        with open(file_path, 'w') as file:
            for line in existing_data:
                key = line.split(":")[0].strip()
                if key in data_dict:
                    file.write(f"{key}: {data_dict[key]}\n")
                else:
                    file.write(line)
            
            for key, value in data_dict.items():
                if key not in existing_data:
                    file.write(f"{key}: {value}\n")
                    
        # print("File updated successfully.")
    except Exception as e:
        print("An error occurred:", e)

# Example usage:
file_path = "data.txt"


ins_list = ['1.png',
            '2.png',
            '3.png',
            '4.png',
            '5.png']

async def instruction_message(call: types.CallbackQuery):
    logger.info(f"{call.from_user.id} - @{call.from_user.username} :  инструкция")
    
    add_rec(call.from_user.id, 0)
    
    await call.message.delete()
    await bot.send_photo(call.from_user.id, FSInputFile('pictures/1.png', 'rb'), reply_markup=get_event_keyboard(0))
        
async def update_instruction(message: types.Message, new_value: int):
    photo = FSInputFile(f'pictures/{new_value + 1}.png')
    await message.edit_media(types.InputMediaPhoto(media=photo), reply_markup=get_event_keyboard(new_value))
    
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
        #print("-1")
        
    await callback.answer()
