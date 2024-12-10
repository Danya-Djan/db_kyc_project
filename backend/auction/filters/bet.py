from django_filters import rest_framework as filters
from users.models import TGUser
from auction.models import Auction, Bet


class BetFilter(filters.FilterSet):
    order_by = filters.OrderingFilter(
        fields=(
            ('_value', 'value'),
            ('created_at', 'created_at'),
            ('id', 'id'),
        ),
        distinct=True
    )
    is_winning = filters.BooleanFilter(field_name='_is_winning')
    auction = filters.ModelChoiceFilter(
        queryset=Auction.objects.all(),
        field_name='auction',
        to_field_name='pk',
    )
    user = filters.ModelChoiceFilter(
        queryset=TGUser.objects.all(),
        field_name='user',
        to_field_name='pk',
    )

    class Meta:
        model = Bet
        fields = ('order_by', 'auction', 'user')
