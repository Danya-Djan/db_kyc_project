import time
import hmac
import base64
import hashlib
import json
from fastapi import Header, HTTPException
from typing import Tuple

from .config import TG_TOKEN

async def get_token_header(authorization: str = Header()) -> Tuple[int, str]:
    if not authorization:
        raise HTTPException(status_code=403, detail='Unauthorized')

    if not authorization.startswith('TelegramToken '):
        raise HTTPException(status_code=403, detail='Unauthorized')

    token = ' '.join(authorization.split()[1:])

    split_res = base64.b64decode(token).decode('utf-8').split(':')
    try:
        data_check_string = ':'.join(split_res[:-1]).strip().replace('/', '\\/')
        _hash = split_res[-1]
    except IndexError:
        raise HTTPException(status_code=403, detail='Unauthorized')
    secret = hmac.new(
        'WebAppData'.encode(),
        str(TG_TOKEN).encode('utf-8'),
        digestmod=hashlib.sha256
    ).digest()
    actual_hash = hmac.new(
        secret,
        msg=data_check_string.encode('utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()
    if _hash != actual_hash:
        raise HTTPException(status_code=403, detail='Unauthorized')

    data_dict = dict([x.split('=') for x in data_check_string.split('\n')])
    try:
        auth_date = int(data_dict['auth_date'])
    except KeyError:
        raise HTTPException(status_code=403, detail='Unauthorized')
    except ValueError:
        raise HTTPException(status_code=403, detail='Unauthorized')

    if auth_date + 60 * 30 < int(time.time()):
        raise HTTPException(status_code=403, detail='Unauthorized')

    user_info = json.loads(data_dict['user'])
    return user_info['id'], token
