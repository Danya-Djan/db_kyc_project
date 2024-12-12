from rest_framework.serializers import ModelSerializer, DecimalField
from auction.models import Bet
from users.serializers import TGUserSerializer


class BetSerializer(ModelSerializer):
    user = TGUserSerializer()
    value = DecimalField(max_digits=102, decimal_places=2, read_only=True)

    class Meta:
        model = Bet
        fields = '__all__'
