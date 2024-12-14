from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove

b1 = KeyboardButton("Подтвердить данные")
b2 = KeyboardButton("Ввести новые")
kb_apply = ReplyKeyboardMarkup(resize_keyboard=True)
kb_apply.row(b1, b2)

b3 = KeyboardButton("Зарегистрироваться")
kb_register = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
kb_register.add(b3)

b5 = KeyboardButton("Поделиться номером📱", request_contact=True)
kb_number = ReplyKeyboardMarkup(resize_keyboard=True)
kb_number.add(b5)

b6 = KeyboardButton('Отправить свою локацию🗺️', request_location=True)
kb_geo = ReplyKeyboardMarkup(resize_keyboard=True)
kb_geo.add(b6)

b7 = KeyboardButton("МЕРОПРИЯТИЯ")
b7_1 = KeyboardButton("BURN APP")
b8 = KeyboardButton("СВЯЗАТЬСЯ С НАМИ")
b9 = KeyboardButton("МОЙ АККАУНТ")
b10 = KeyboardButton("BURN COMMUNITY")
b11 = KeyboardButton("КАТАЛОГ")
kb_main = ReplyKeyboardMarkup(resize_keyboard=True)
kb_main.add(b7, b7_1)
kb_main.add(b8, b9)
kb_main.add(b10, b11)


b11 = KeyboardButton("Подтверждаю и соглашаюсь")
b12 = KeyboardButton("Спасибо, но нет")
kb_apply = ReplyKeyboardMarkup(resize_keyboard=True)
kb_apply.add(b11)
kb_apply.add(b12)