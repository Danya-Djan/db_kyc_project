from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, urlencode
from django_cte import With
from auction.models import Auction, Bet, Product
from users.models import TGUser


@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'view_product_link',
        'quantity',
        'end_time',
        'is_active',
        'view_winners_link',
        'view_betters_link',
        'view_bets_link',
        'initial_end_time',
        'last_call_delta',
        'times_postponed',
        'initial_cost',
        'commission',
    ]
    list_display_links = [
        'id',
    ]
    autocomplete_fields = [
        'product'
    ]
    readonly_fields = ['times_postponed']

    def end_time(self, obj):
        return obj._end_time
    end_time.admin_order_field = '_end_time'
    end_time.short_description = 'Дата окончания'

    def is_active(self, obj):
        return obj._is_active
    is_active.admin_order_field = '_is_active'
    is_active.short_description = 'Активен ли'
    is_active.boolean = True

    def view_product_link(self, obj):
        url = reverse("admin:auction_product_change", args=[obj.product_id])
        return format_html(f'<a href="{url}">{obj.product.name} ({obj.product_id})</a>')
    view_product_link.short_description = 'Товар'

    def view_betters_link(self, obj):
        count = obj.betters.distinct().count()
        url = reverse('admin:users_tguser_changelist') + '?' + urlencode({'betters__pk': f'{obj.pk}'})
        return format_html(f'<a href="{url}"> {count} users </a>')
    view_betters_link.short_description = 'Пользователи, сделавшие ставки'

    def view_bets_link(self, obj):
        count = obj.bets.count()
        url = reverse('admin:auction_bet_changelist') + '?' + urlencode({'auction_id': f'{obj.pk}'})
        return format_html(f'<a href="{url}"> {count} bets </a>')
    view_bets_link.short_description = 'Ставки'

    def view_winners_link(self, obj):
        winning_user_ids = obj.bets.filter(_is_winning=True).values_list('user_id', flat=True)
        count = winning_user_ids.count()
        url = reverse('admin:users_tguser_changelist') + '?' + urlencode({'pk__in': ','.join(map(str, winning_user_ids))})
        return format_html(f'<a href="{url}"> {count} победителей </a>')
    view_winners_link.short_description = 'Победители'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'view_auctions_link',
        'name',
        'cover',
        'description',
    ]
    list_display_links = [
        'id'
    ]
    search_fields = [
        'name'
    ]

    def view_auctions_link(self, obj):
        count = obj.auctions.count()
        url = reverse('admin:auction_auction_changelist') + '?' + urlencode({'product_id': f'{obj.pk}'})
        return format_html(f'<a href="{url}"> {count} auctions </a>')
    view_auctions_link.short_description = 'Аукционы'


class IsWinningListFilter(admin.SimpleListFilter):
    title = 'Является ли победной'
    parameter_name = '_is_winning'

    def lookups(self, request, model_admin):
        return (
            (True, 'Да'),
            (False, 'Нет')
        )

    def queryset(self, request, queryset):
        if self.value() is not None:
            return queryset.filter(**{self.parameter_name: self.value()})
        return queryset

@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'view_user_link',
        'view_auction_link',
        'created_at',
        'view_transactions_link',
    ]
    list_display_links = [
        'id',
    ]
    list_filter = [
        IsWinningListFilter
    ]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def view_user_link(self, obj):
        url = reverse("admin:users_tguser_change", args=[obj.user_id])
        return format_html(f'<a href="{url}">{obj.user}</a>')
    view_user_link.short_description = 'Пользователь'

    def view_auction_link(self, obj):
        url = reverse("admin:auction_auction_change", args=[obj.auction_id])
        return format_html(f'<a href="{url}">{obj.auction}</a>')
    view_auction_link.short_description = 'Аукцион'

    def view_transactions_link(self, obj):
        count = obj.transactions.count()
        url = reverse('admin:users_bettransaction_changelist') + '?' + urlencode({'bet_id': f'{obj.pk}'})
        return format_html(f'<a href="{url}"> {count} transactions </a>')
    view_transactions_link.short_description = 'Транзакции'
