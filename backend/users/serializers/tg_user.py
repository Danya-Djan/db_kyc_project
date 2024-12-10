from rest_framework.serializers import ModelSerializer, DecimalField, IntegerField
from users.models import TGUser


class TGUserSerializer(ModelSerializer):
    max_storage = DecimalField(decimal_places=2, max_digits=102, read_only=True)
    rank = IntegerField(read_only=True)

    class Meta:
        model = TGUser
        exclude = ('user',)
        read_only_fields = ('created_at', 'points', 'username', 'referred_by', 'referral_storage', 'tg_id',)
