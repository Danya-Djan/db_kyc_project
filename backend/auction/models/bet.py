from django.db import models
from django.db.models import Subquery, OuterRef, Exists
from django_cte import CTEManager
from users.models import CommissionTransaction, BetTransaction


class BetManager(CTEManager):
    def get_queryset(self):
        return super().get_queryset().annotate(
            _is_winning=Exists(BetTransaction.objects.filter(bet=OuterRef('pk'), refunded_by__isnull=True, refund_to__isnull=True)),
            _value=-Subquery(BetTransaction.objects.filter(bet=OuterRef('pk')).order_by('date').values('value')[:1])
        ).distinct()

    def create_with_transaction_and_commission(self, auction, user, value, commission_value):
        return CommissionTransaction.objects.create(
            parent_transaction=BetTransaction.objects.create(
                value=-value,
                user=user,
                bet=Bet.objects.create(
                    auction=auction,
                    user=user,
                )
            ),
            value=-commission_value,
            user=user,
        ).parent_transaction.bet


class Bet(models.Model):
    class Meta:
        verbose_name = 'Ставка'
        verbose_name_plural = 'Ставки'

    auction = models.ForeignKey('auction.Auction', related_name='bets', on_delete=models.CASCADE,
                                verbose_name='Аукцион')
    user = models.ForeignKey('users.TGUser', related_name='bets', on_delete=models.CASCADE,
                             verbose_name='Пользователь')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания')

    objects = BetManager()

    def __str__(self):
        return f'Ставка {self.user} на {self.auction} от {self.created_at}'

    @property
    def is_winning(self):
        return self._is_winning

    @property
    def value(self):
        return self._value

    @property
    def transaction(self):
        return self.transactions.get(refunded_by__isnull=True)
