from django.db import models


class Button(models.Model):
    class Meta:
        verbose_name = 'Кнопка'
        verbose_name_plural = 'Кнопки'

    text = models.TextField(verbose_name='Текст на кнопке')
    link = models.CharField(max_length=250, verbose_name='Ссылка на кнопке')

    def __str__(self):
        return f'Кнопка №{self.pk}'
