from django.urls import include, path
from auction.views import (
    AuctionList, BetList, place_bet
)

urlpatterns = [
    path('auction', AuctionList.as_view(), name='auction-list'),
    path('bet', BetList.as_view(), name='bet-list'),
    path('auction/<int:pk>/place-bet/', place_bet, name='place-bet'),
]
