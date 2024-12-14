import json
import re

import requests
from loguru import logger
from create_bot import request_url, api_token
from operator import itemgetter
from loguru import logger

def check_register(tg_id):
    data = requests.get(f'{request_url}/internal/users/check/{tg_id}')
    return data.status_code == 200

def check_admin(tg_id):
    data = requests.get(f'{request_url}/users/get/{tg_id}/', headers={'Authorization': f'Token {api_token}'}).json()
    if len(data) > 3:
        if data['is_staff']:
            return True
        else:
            return False
    else:
        return False