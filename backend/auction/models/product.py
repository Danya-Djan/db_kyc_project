from django.db import models


class Product(models.Model):
    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    name = models.CharField(max_length=250, verbose_name='Название')
    cover = models.FileField(upload_to='products/', verbose_name='Обложка')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return f'{self.name} ({self.pk})'
