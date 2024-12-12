from django_filters import rest_framework as filters
from rest_framework.generics import ListAPIView, GenericAPIView
from auction.serializers import BetSerializer
from auction.models import Bet
from auction.filters import BetFilter


class BetList(ListAPIView):
    queryset = Bet.objects.all()
    serializer_class = BetSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = BetFilter
