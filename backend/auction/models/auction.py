from datetime import datetime
from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.db.models import F, Case, When, Max, ExpressionWrapper, Subquery, OuterRef
from users.models import BetTransaction


class AuctionManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().annotate(
            _end_time=ExpressionWrapper(
                F('initial_end_time') + F('last_call_delta') * F('times_postponed'),
                output_field=models.DateTimeField()
            )
        ).annotate(_is_active=Case(
            When(_end_time__gt=timezone.now(), then=True),
            default=False,
        )).annotate(
            _min_bet_value=Case(
                When(bets__isnull=True, then=F('initial_cost')),
                default=Subquery(BetTransaction.objects.filter(bet__auction=OuterRef('pk')).order_by('-value').values('value')[:1]) + Decimal('0.01')
            )
        ).distinct()


class Auction(models.Model):
    class Meta:
        verbose_name = 'Аукцион'
        verbose_name_plural = 'Аукционы'

    product = models.ForeignKey('auction.Product', related_name='auctions', on_delete=models.CASCADE,
                                verbose_name='Товар')
    quantity = models.PositiveIntegerField(verbose_name='Количество победителей')
    betters = models.ManyToManyField('users.TGUser', through='auction.Bet', related_name='auctions',
                                     verbose_name='Поставившие ставку')
    initial_end_time = models.DateTimeField(verbose_name='Изначальная дата окончания')
    last_call_delta = models.DurationField(verbose_name='Время последнего шага')
    times_postponed = models.IntegerField(default=0, verbose_name='Количество переносов')
    commission = models.DecimalField(decimal_places=2, max_digits=5, verbose_name='Комиссия',
                                     help_text='Десятичная дробь')
    initial_cost = models.DecimalField(decimal_places=2, max_digits=102, verbose_name='Начальная стоимость')

    objects = AuctionManager()

    def __str__(self):
        return f'Аукцион №{self.pk}'

    def check_postpone(self):
        if timezone.now() - self.last_call_delta <= self.end_time <= timezone.now():
            self.times_postponed = F('times_postponed') + 1
            self.save()

    @property
    def end_time(self):
        return self._end_time

    @property
    def is_active(self):
        return self._is_active

    @property
    def min_bet_value(self):
        return self._min_bet_value


