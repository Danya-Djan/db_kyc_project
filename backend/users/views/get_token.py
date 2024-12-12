import base64
import hashlib
import hmac
import json
import time
from rest_framework.decorators import api_view, schema, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN
from django.conf import settings
from users.models import TGUser


@api_view(['GET'])
@permission_classes([])
@authentication_classes([])
@schema(None)
def get_token(request, pk):
    auth_date = int(time.time())
    if TGUser.objects.filter(pk=pk).exists():
        user_info = {
            'id': pk,
            'username': TGUser.objects.get(pk=pk).username
        }
    else:
        user_info = {
            'id': pk
        }
    data_check_string = f'auth_date={auth_date}\nuser={json.dumps(user_info)}'
    secret = hmac.new(
        'WebAppData'.encode(),
        settings.TG_TOKEN.encode('utf-8'),
        digestmod=hashlib.sha256
    ).digest()
    secret_hash = hmac.new(
        secret,
        msg=data_check_string.encode('utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()
    return Response({'token': base64.b64encode(f'{data_check_string}:{secret_hash}'.encode('utf-8'))})



