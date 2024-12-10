from django.db.models import F
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.decorators import api_view
from users.serializers import TGUserSerializer


@api_view(['POST'])
def warn(request):
    tg_user = request.user.tg_user
    tg_user.warning_count = F('warning_count') + 1
    tg_user.save(update_fields=('warning_count',))
    tg_user.refresh_from_db()
    serializer = TGUserSerializer(tg_user).data
    return Response(status=HTTP_200_OK, data=serializer.data)
