from decimal import Decimal
from django.db.models import Sum, Case, When, F, OuterRef, Subquery
from django.db.models.functions import RowNumber
from django.db.models.expressions import Window
from django.db import models
from django.contrib.auth.models import User
from django_cte import CTEManager, With
from misc.models import Setting


class TGUser(models.Model):
    class Meta:
        verbose_name = 'ТГ-пользователь'
        verbose_name_plural = 'ТГ-пользователи'
        constraints = [
            models.UniqueConstraint(fields=('tg_id',), name='unique_tg_id')
        ]

    user = models.OneToOneField(User, related_name='tg_user', on_delete=models.CASCADE, verbose_name='Пользователь')
    tg_id = models.PositiveBigIntegerField(primary_key=True, verbose_name='Telegram ID')
    username = models.CharField(max_length=250, verbose_name='Telegram username')
    avatar = models.FileField(upload_to='users/', null=True, blank=True, verbose_name='Аватарка')
    points = models.DecimalField(default=0, decimal_places=2, max_digits=102, verbose_name='Баллы')
    referred_by = models.ForeignKey('users.TGUser', related_name='referrees', on_delete=models.SET_NULL,
                                    null=True, blank=True, verbose_name='Кем был приглашен')
    referral_storage = models.DecimalField(decimal_places=5, max_digits=102, default=0, verbose_name='Реферальное хранилище')
    warning_count = models.IntegerField(default=0, verbose_name='Количество предупреждений')
    is_blocked = models.BooleanField(default=False, verbose_name='Заблокирован ли')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания')

    objects = CTEManager()

    @property
    def max_storage(self):
        return Decimal(Setting.objects.get(name='MAX_STORAGE').value['value']) * (self.referrees.count() + 1)

    @property
    def rank(self):
        return getattr(self, 'row_number', -1)

    def __str__(self):
        return f'{self.username} (№{self.tg_id})'

