from django_filters import rest_framework as filters
from rest_framework.generics import ListAPIView
from auction.serializers import AuctionSerializer
from auction.models import Auction, Bet
from auction.filters import AuctionFilter


class AuctionList(ListAPIView):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = AuctionFilter

