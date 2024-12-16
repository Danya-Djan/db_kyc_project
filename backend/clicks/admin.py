from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from clicks.models import Click


@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'view_user_link',
        'value',
        'created_at',
        'view_transaction_link',
    ]
    list_display_links = [
        'id',
    ]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def view_user_link(self, obj):
        url = reverse("admin:users_tguser_change", args=[obj.user_id])
        return format_html('<a href="{}">{}</a>', url, obj.user)
    view_user_link.short_description = 'Пользователь'

    def view_transaction_link(self, obj):
        url = reverse("admin:users_clicktransaction_change", args=[obj.transaction.id])
        return format_html('<a href="{}">{}</a>', url, obj.transaction)
    view_transaction_link.short_description = 'Транзакция'
