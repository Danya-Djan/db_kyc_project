from rest_framework.serializers import ModelSerializer, DateTimeField, BooleanField
from .product import ProductSerializer
from auction.models import Auction


class AuctionSerializer(ModelSerializer):
    product = ProductSerializer()
    end_time = DateTimeField(read_only=True)
    is_active = BooleanField(read_only=True)

    class Meta:
        model = Auction
        exclude = ('betters', 'initial_end_time', 'times_postponed', 'last_call_delta')
