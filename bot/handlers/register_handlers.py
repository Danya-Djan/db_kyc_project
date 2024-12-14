from aiogram import Dispatcher, types
from aiogram.dispatcher.filters import Text
from aiogram.types.message import ContentType

from handlers.start_handler import (command_start,
                                    get_main_menu_answer,
                                    get_main_menu_after_picture)

from handlers.instruction import (instruction_message,
                                  callbacks_instruction)



def register_all_handlers(dp: Dispatcher):
    handle_register_start_message(dp)
    handle_instruction_message(dp)
    
    
def handle_register_start_message(dp: Dispatcher):
    dp.register_message_handler(command_start, commands=['start'])
    dp.register_callback_query_handler(get_main_menu_answer, Text(equals='main_menu'))
    dp.register_callback_query_handler(instruction_message, Text(equals="instruction_inline"))
    dp.register_callback_query_handler(get_main_menu_after_picture, Text(equals='main_menu_delete'))
    
def handle_instruction_message(dp: Dispatcher):
    dp.register_callback_query_handler(callbacks_instruction, Text(startswith="num_"))

