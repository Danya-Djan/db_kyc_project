from aiogram import Router
from aiogram.filters import Command
from aiogram import F

from handlers.start_handler import (command_start,
                                    get_main_menu_answer,
                                    get_main_menu_after_picture)

from handlers.instruction import (instruction_message,
                                  callbacks_instruction)



def register_all_handlers(router: Router):
    handle_register_start_message(router)
    handle_instruction_message(router)
    
    
def handle_register_start_message(router: Router):
    router.message.register(command_start, Command(commands=["start"]))
    router.callback_query.register(get_main_menu_after_picture, F.data.startswith('main_menu_delete'))
    router.callback_query.register(get_main_menu_answer, F.data.startswith('main_menu'))
    router.callback_query.register(instruction_message, F.data.startswith("instruction_inline"))
    
def handle_instruction_message(router: Router):
    router.callback_query.register(callbacks_instruction, F.data.startswith("num_"))

