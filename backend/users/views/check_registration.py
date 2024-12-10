from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from users.models import TGUser


@api_view()
@permission_classes([])
@authentication_classes([])
def check_registration(request, pk):
    return Response(status=HTTP_200_OK) if TGUser.objects.filter(pk=pk).exists() else Response(status=HTTP_404_NOT_FOUND)