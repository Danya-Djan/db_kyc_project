from aiogram import Bot
import os

token = os.getenv('TG_TOKEN', '7748003961:AAEIXu8NFICPabNaQP5JQ3AcY79nZdUbKdI')
api_token = os.getenv('API_TOKEN', 'b43fa8ccea5b6dd5e889a8ad3890ce14ce36a8bc')  # TODO: remove
backend_url = os.getenv('BACKEND_URL', 'http://backend:8000')
request_url = f'{backend_url}/api'
url = os.getenv('APP_URL', 'https://google.com')
bot_name = os.getenv('BOT_NAME', 'https://t.me/danyadjan_test_bot')

bucket_name = 'brawny-basket'
username = 'e80165bc-8d55-42a3-a96b-f62314446f87'
password = '0d8e160fc5625ff0f176a0f70a22e336e8fb21a9841a5d20223714b7cee19341'
endpoint_url = 'https://s3.aeza.cloud/brawny-basket'

WEBHOOK_HOST = f'{url}/bot'
WEBHOOK_PATH = 'wh'
WEBHOOK_URL = f'{WEBHOOK_HOST}/{WEBHOOK_PATH}/{token}'

bot = Bot(token=token)

important_message = {}

event_number = {}