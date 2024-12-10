from django.db import models


class Banner(models.Model):
    class Meta:
        verbose_name = 'Баннер'
        verbose_name_plural = 'Баннеры'

    name = models.CharField(max_length=250, verbose_name='Название')
    media = models.FileField(upload_to='banners/', verbose_name='Обложка')
    button = models.ForeignKey('misc.Button', related_name='banners', on_delete=models.CASCADE,
                               null=True, blank=True,
                               verbose_name='Кнопка')
    is_available = models.BooleanField(verbose_name='Доступен ли')

    def __str__(self):
        return f'{self.name} ({self.pk})'

