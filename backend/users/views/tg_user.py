from rest_framework import viewsets, mixins
from rest_framework.settings import api_settings
from users.serializers import TGUserSerializer
from users.models import TGUser
from users.permissions import IsAdminOrIsSelf


class TGUserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = TGUserSerializer
    queryset = TGUser.objects.all()

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            permissions = [*api_settings.DEFAULT_PERMISSION_CLASSES, IsAdminOrIsSelf]
        else:
            permissions = api_settings.DEFAULT_PERMISSION_CLASSES
        return [permission() for permission in permissions]