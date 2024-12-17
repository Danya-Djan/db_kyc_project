from django import forms
from django.apps import apps
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, urlencode
from django.http import HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin, PolymorphicChildModelFilter
from users.models import (
    TGUser, MailingList, MailingListReceiverInfo, Transaction, ClickTransaction, BetTransaction, ReferralTransaction,
    CommissionTransaction
)


@admin.register(TGUser)
class TGUserAdmin(admin.ModelAdmin):
    model = TGUser
    list_display = [
        'view_user_link',
        'tg_id',
        'username',
        'points',
        'avatar',
        'warning_count',
        'is_blocked',
        'created_at',
        'view_referred_by_link',
        'view_referred_users_link',
        'view_transactions',
        'view_clicks_link',
    ]
    list_display_links = [
        'tg_id'
    ]
    search_fields = [
        'username',
        'tg_id'
    ]
    actions = ['create_mailing_list']

    def get_readonly_fields(self, request, obj=None):
        always = [
            'points',
            'referral_storage',
            'warning_count',
            'created_at'
        ]
        when_editing = [
            'tg_id',
            'user',
            'username',
            'referred_by',
        ]
        if obj:
            return always + when_editing
        else:
            return always

    def view_user_link(self, obj):
        url = reverse("admin:auth_user_change", args=[obj.user_id])
        return format_html('<a href="{}">{} ({})</a>', url, obj.user.username, obj.user_id)
    view_user_link.short_description = 'Системный пользователь'

    def view_referred_by_link(self, obj):
        if not obj.referred_by:
            return
        url = reverse("admin:users_tguser_change", args=[obj.referred_by.tg_id])
        return format_html('<a href="{}">{} ({})</a>', url, obj.referred_by.username, obj.referred_by.tg_id)
    view_referred_by_link.short_description = 'Кем был приглашен'

    def view_referred_users_link(self, obj):
        count = obj.referrees.count()
        url = reverse('admin:users_tguser_changelist') + '?' + urlencode({'referred_by__tg_id': f'{obj.tg_id}'})
        return format_html('<a href="{}"> {} users </a>', url, count)
    view_referred_users_link.short_description = 'Приглашенные пользователи'

    def view_transactions(self, obj):
        all_url = reverse('admin:users_transaction_changelist') + '?' + urlencode({'user_id': f'{obj.tg_id}'})
        click_url = reverse('admin:users_clicktransaction_changelist') + '?' + urlencode({'user_id': f'{obj.tg_id}'})
        bet_url = reverse('admin:users_bettransaction_changelist') + '?' + urlencode({'user_id': f'{obj.tg_id}'})
        commission_url = reverse('admin:users_commissiontransaction_changelist') + '?' + urlencode({'user_id': f'{obj.tg_id}'})
        referral_url = reverse('admin:users_referraltransaction_changelist') + '?' + urlencode({'user_id': f'{obj.tg_id}'})

        return format_html(
            '<a href="{}"> все </a> // '
            '<a href="{}"> клики </a> // '
            '<a href="{}"> ставки </a> // '
            '<a href="{}"> комиссии </a> // '
            '<a href="{}"> реферальная программа </a>',
            all_url, click_url, bet_url, commission_url, referral_url
        )
    view_transactions.short_description = 'Транзакции'

    def view_clicks_link(self, obj):
        count = obj.clicks.count()
        url = reverse('admin:clicks_click_changelist') + '?' + urlencode({'user_id': f'{obj.tg_id}'})
        return format_html('<a href="{}"> {} clicks </a>', url, count)
    view_clicks_link.short_description = 'Клики'

    @admin.action(description="Создать рассылку для выбранных пользователей")
    def create_mailing_list(self, request, queryset):
        request.session['user_ids'] = list(queryset.values_list('pk', flat=True))
        return HttpResponseRedirect(reverse('admin:users_mailinglist_add'))


class MailingListAdminForm(forms.ModelForm):
    users = forms.ModelMultipleChoiceField(
        queryset=TGUser.objects.all(),
        required=False,
        label='Получатели'
    )

    class Meta:
        model = MailingList
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MailingListAdminForm, self).__init__(*args, **kwargs)

        if self.instance.pk:
            self.fields['users'].initial = self.instance.users.all()

    def save(self, commit=True):
        mailing_list = super(MailingListAdminForm, self).save(commit=False)
        MailingListReceiverInfo.objects.filter(mailing_list_id=mailing_list.pk).delete()
        new_mailing_list_receiver_infos = list()
        for user in self.cleaned_data['users']:
            new_mailing_list_receiver_infos.append(MailingListReceiverInfo(
                mailing_list_id=mailing_list.pk,
                user_id=user.pk
            ))

        if commit:
            MailingListReceiverInfo.objects.bulk_create(new_mailing_list_receiver_infos)

        return mailing_list


@admin.register(MailingListReceiverInfo)
class MailingListReceiverInfoAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'view_mailing_list_link',
        'view_user_link',
        'sent',
        'clicked'
    ]
    list_display_links = [
        'id'
    ]
    readonly_fields = [
        'sent',
        'clicked'
    ]
    list_filter = [
        'sent',
        'clicked'
    ]

    def view_user_link(self, obj):
        if not obj.user:
            return None
        link = reverse("admin:users_tguser_change", args=[obj.user.tg_id])
        return format_html('<a href="{}">{}</a>', link, obj.user)
    view_user_link.short_description = 'Пользователь'

    def view_mailing_list_link(self, obj):
        if not obj.mailing_list:
            return None
        link = reverse("admin:users_mailinglist_change", args=[obj.mailing_list.pk])
        return format_html('<a href="{}">{}</a>', link, obj.mailing_list)
    view_mailing_list_link.short_description = 'Рассылка'


@admin.register(MailingList)
class MailingListAdmin(admin.ModelAdmin):
    form = MailingListAdminForm
    model = MailingList
    list_display = [
        'id',
        'name',
        'time',
        'text',
        'media',
        'view_users_link',
        'view_mailing_list_receiver_infos_link',
        'status',
        'view_main_button_link',
        'view_webapp_button_link',
    ]
    list_display_links = [
        'id'
    ]

    def get_readonly_fields(self, request, obj=None):
        return ('status',)

    def get_changeform_initial_data(self, request):
        if user_ids := request.session.get('user_ids'):
            return {'users': TGUser.objects.filter(pk__in=user_ids)}
        return None

    def view_users_link(self, obj):
        count = obj.users.count()
        url = reverse('admin:users_tguser_changelist') + '?' + urlencode(
            {'mailing_lists__id': f'{obj.id}'})
        return format_html('<a href="{}"> {} пользователей </a>', url, count)
    view_users_link.short_description = 'Пользователи'

    def view_mailing_list_receiver_infos_link(self, obj):
        count = obj.mailing_list_receiver_infos.count()
        url = reverse('admin:users_mailinglistreceiverinfo_changelist') + '?' + urlencode(
            {'mailing_list_id': f'{obj.id}'})
        return format_html('<a href="{}"> {} получателей </a>', url, count)
    view_mailing_list_receiver_infos_link.short_description = 'Информация о получателях'

    def view_main_button_link(self, obj):
        if not obj.main_button:
            return
        url = reverse("admin:misc_button_change", args=[obj.main_button_id])
        return format_html('<a href="{}"> Кнопка №{}</a>', url, obj.main_button_id)
    view_main_button_link.short_description = 'Основная кнопка'

    def view_webapp_button_link(self, obj):
        if not obj.webapp_button:
            return
        url = reverse("admin:misc_button_change", args=[obj.webapp_button_id])
        return format_html('<a href="{}"> Кнопка №{}</a>', url, obj.webapp_button_id)
    view_webapp_button_link.short_description = 'Кнопка, открывающая вебапп'


# TODO
class TransactionChildAdmin(PolymorphicChildModelAdmin):
    base_model = Transaction
    search_fields = [
        'user__username',
        'user__tg_id'
    ]

    def view_user_link(self, obj):
        if not obj.user:
            return
        url = reverse("admin:users_tguser_change", args=[obj.user.tg_id])
        return format_html('<a href="{}">{}</a>', url, obj.user)
    view_user_link.short_description = 'Пользователь'

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(ClickTransaction)
class ClickTransactionAdmin(TransactionChildAdmin):
    base_model = ClickTransaction
    show_in_index = True
    list_display = [
        'id',
        'value',
        'view_user_link',
        'date',
        'view_click_link'
    ]

    def view_click_link(self, obj):
        link = reverse("admin:clicks_click_change", args=[obj.click_id])
        return format_html('<a href="{}"> {}</a>', link, obj.click)
    view_click_link.short_description = 'Клик'


@admin.register(BetTransaction)
class BetTransactionAdmin(TransactionChildAdmin):
    base_model = BetTransaction
    show_in_index = True
    list_display = [
        'id',
        'value',
        'view_user_link',
        'date',
        'view_bet_link',
        'view_commission_link',
        'view_refunded_by_link',
        'view_refund_to_link',
    ]
    list_display_links = [
        'id'
    ]

    def view_bet_link(self, obj):
        link = reverse("admin:auction_bet_change", args=[obj.bet_id])
        return format_html('<a href="{}">{}</a>', link, obj.bet)
    view_bet_link.short_description = 'Ставка'

    def view_commission_link(self, obj):
        try:
            _ = obj.commission
        except ObjectDoesNotExist:
            return None
        link = reverse("admin:users_commissiontransaction_change", args=[obj.commission.id])
        return format_html('<a href="{}"> {} </a>', link, obj.commission)
    view_commission_link.short_description = 'Комиссия'

    def view_refunded_by_link(self, obj):
        try:
            _ = obj.refunded_by
        except ObjectDoesNotExist:
            return None
        link = reverse("admin:users_bettransaction_change", args=[obj.refunded_by.id])
        return format_html('<a href="{}"> {} </a>', link, obj.refunded_by)
    view_refunded_by_link.short_description = 'Чем компенсирована'

    def view_refund_to_link(self, obj):
        if not obj.refund_to:
            return None
        link = reverse("admin:users_bettransaction_change", args=[obj.refund_to_id])
        return format_html('<a href="{}"> {} </a>', link, obj.refund_to)
    view_refund_to_link.short_description = 'Что компенсирует'


@admin.register(CommissionTransaction)
class CommissionTransactionAdmin(TransactionChildAdmin):
    base_model = CommissionTransaction
    show_in_index = True
    list_display = [
        'id',
        'value',
        'view_user_link',
        'date',
        'view_bet_transaction_link',
    ]
    list_display_links = [
        'id'
    ]

    def view_bet_transaction_link(self, obj):
        link = reverse("admin:users_bettransaction_change", args=[obj.parent_transaction])
        return format_html('<a href="{}"> {} </a>', link, obj.parent_transaction)
    view_bet_transaction_link.short_description = 'Родительская транзакция'


@admin.register(ReferralTransaction)
class ReferralTransactionAdmin(TransactionChildAdmin):
    base_model = ReferralTransaction
    show_in_index = True
    list_display = [
        'id',
        'value',
        'view_user_link',
        'date',
    ]


# оригинальный класс использовал "change" в lookups
class WorkingPolymorphicChildModelFilter(PolymorphicChildModelFilter):
    def lookups(self, request, model_admin):
        return model_admin.get_child_type_choices(request, "view")


@admin.register(Transaction)
class TransactionParentAdmin(PolymorphicParentModelAdmin):
    base_model = Transaction
    child_models = [
        ClickTransaction, BetTransaction, CommissionTransaction, ReferralTransaction
    ]
    list_filter = [
        WorkingPolymorphicChildModelFilter,
    ]
    search_fields = [
        'user__username',
        'user__tg_id'
    ]
    list_display = [
        'id',
        'view_user_link',
        'value',
        'date',
        'view_type'
    ]
    list_display_links = [
        'id'
    ]

    def view_user_link(self, obj):
        if not obj.user:
            return
        url = reverse("admin:users_tguser_change", args=[obj.user.tg_id])
        return format_html('<a href="{}">{}</a>', url, obj.user)
    view_user_link.short_description = 'Пользователь'

    def view_type(self, obj):
        return apps.get_model(obj.polymorphic_ctype.app_label, obj.polymorphic_ctype.model)._meta.verbose_name
    view_type.short_description = 'Тип транзакции'

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_view_permission(self, request, obj=None):
        return True
