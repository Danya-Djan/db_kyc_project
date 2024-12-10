from django_filters import rest_framework as filters
from auction.models import Auction, Product


class AuctionFilter(filters.FilterSet):
    order_by = filters.OrderingFilter(
        fields=(
            ('_is_active', 'is_active'),
            ('_end_time', 'end_time'),
            ('id', 'id'),
        ),
        distinct=True
    )
    is_active = filters.BooleanFilter(field_name='_is_active')
    product = filters.ModelMultipleChoiceFilter(
        queryset=Product.objects.all(),
        field_name='product__pk',
        to_field_name='pk',
        distinct=True
    )

    class Meta:
        model = Auction
        fields = ('order_by', 'is_active', 'product')
