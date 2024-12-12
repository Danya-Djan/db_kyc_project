import json
import re

import requests
from loguru import logger
from create_bot import request_url, api_token
from operator import itemgetter
from loguru import logger

def check_register(tg_id):
    return False

def check_admin(tg_id):
    return 0