import time
import hmac
import base64
import hashlib
import json
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions
from users.models import TGUser


def validate_referred_by_id(referred_by_id):
    if not referred_by_id:
        return None
    if not referred_by_id.isdigit():
        return None
    referred_by_id = int(referred_by_id)
    return referred_by_id if TGUser.objects.filter(pk=referred_by_id).exists() else None


class TelegramValidationAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token:
            return None, None

        if not token.startswith('TelegramToken '):
            return None, None

        token = ' '.join(token.split()[1:])

        split_res = base64.b64decode(token).decode('utf-8').split(':')
        try:
            data_check_string = ':'.join(split_res[:-1]).strip().replace('/', '\\/')
            _hash = split_res[-1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid token format')
        secret = hmac.new(
            'WebAppData'.encode(),
            settings.TG_TOKEN.encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()
        actual_hash = hmac.new(
            secret,
            msg=data_check_string.encode('utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()
        if _hash != actual_hash:
            raise exceptions.AuthenticationFailed('Invalid token (hash check failed)')

        data_dict = dict([x.split('=') for x in data_check_string.split('\n')])
        try:
            auth_date = int(data_dict['auth_date'])
        except KeyError:
            raise exceptions.AuthenticationFailed('Invalid token (auth_date not found)')
        except ValueError:
            raise exceptions.AuthenticationFailed('Invalid token (auth_date is not an int)')

        if auth_date + 60 * 30 < int(time.time()):
            raise exceptions.AuthenticationFailed('Token expired')

        user_info = json.loads(data_dict['user'])
        try:
            tg_user = TGUser.objects.get(pk=user_info['id'])
            if tg_user.is_blocked:
                raise exceptions.PermissionDenied('Пользователь заблокирован')
        except ObjectDoesNotExist:
            username = user_info.get('username', f'user-{user_info["id"]}')
            pass_data = f'{username} ({user_info["id"]})'.encode()
            referred_by_id = validate_referred_by_id(request.query_params.get('referred_by', None))
            if (user_qs := User.objects.filter(username=username)).exists():
                user = user_qs.first()
            else:
                user = User.objects.create_user(
                    username=username,
                    password=hashlib.md5(pass_data).hexdigest()
                )
            tg_user = TGUser.objects.create(
                user=user,
                tg_id=user_info['id'],
                username=username,
                referred_by_id=referred_by_id,
            )

        return tg_user.user, token
