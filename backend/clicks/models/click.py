from django.db import models


class Click(models.Model):
    class Meta:
        verbose_name = 'Клик'
        verbose_name_plural = 'Клики'

    user = models.ForeignKey('users.TGUser', related_name='clicks', on_delete=models.DO_NOTHING, db_constraint=False,
                             verbose_name='Пользователь')
    value = models.DecimalField(decimal_places=2, max_digits=102, verbose_name='Значение')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')

    def __str__(self):
        return f'Клик {self.user} от {self.created_at.strftime("%d.%m.%Y %H:%M:%S")} ({self.pk})'
