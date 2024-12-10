from django.db import models
from polymorphic.models import PolymorphicModel


class Transaction(PolymorphicModel):
    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'

    user = models.ForeignKey('users.TGUser', related_name='transactions', on_delete=models.DO_NOTHING,
                             db_constraint=False, verbose_name='Пользователь')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')
    value = models.DecimalField(decimal_places=5, max_digits=105, verbose_name='Значение')

    def __str__(self):
        return f'{self._meta.verbose_name} {self.user} от {self.date.strftime("%d.%m.%Y %H:%M")}'


class ClickTransaction(Transaction):
    class Meta:
        verbose_name = 'Транзакция за клик'
        verbose_name_plural = 'Транзакции за клики'

    click = models.OneToOneField('clicks.Click', related_name='transaction', on_delete=models.CASCADE,
                                 verbose_name='Клик')


class BetTransaction(Transaction):
    class Meta:
        verbose_name = 'Транзакция за ставку'
        verbose_name_plural = 'Транзакции за ставки'

    bet = models.ForeignKey('auction.Bet', related_name='transactions', on_delete=models.CASCADE,
                               verbose_name='Ставка')
    refund_to = models.OneToOneField('users.BetTransaction', related_name='refunded_by', on_delete=models.CASCADE,
                                     null=True, blank=True,
                                     verbose_name='Какую транзакцию отменяет')

    def refund(self):
        return BetTransaction.objects.create(
            user_id=self.user_id,
            value=-self.value,
            bet_id=self.bet_id,
            refund_to_id=self.pk,
        )


class CommissionTransaction(Transaction):
    class Meta:
        verbose_name = 'Комиссионная транзакция'
        verbose_name_plural = 'Комиссионные транзакции'

    parent_transaction = models.OneToOneField('users.BetTransaction', related_name='commission',
                                              on_delete=models.CASCADE, verbose_name='Родительская транзакция')


class ReferralTransaction(Transaction):
    class Meta:
        verbose_name = 'Реферальная транзакция'
        verbose_name_plural = 'Реферальные транзакции'

    def __str__(self):
        return f'Начисление баллов по реферальной программе {self.user}'

