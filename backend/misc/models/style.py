from django.db import models
from django.core.validators import RegexValidator


_color_validator = RegexValidator(
    regex=r'#[0-9A-F]{6}',
    message='Пожалуйста введите название текста в формате #11AA11'
)


class Style(models.Model):
    class Meta:
        verbose_name = 'Стиль'
        verbose_name_plural = 'Стили'

    name = models.CharField(max_length=250, verbose_name='Название')
    color_1 = models.CharField(max_length=7, validators=[_color_validator], verbose_name='Основной цвет')
    color_2 = models.CharField(max_length=7, validators=[_color_validator], verbose_name='Цвет №2')
    color_3 = models.CharField(max_length=7, validators=[_color_validator], verbose_name='Цвет №3')
    color_4 = models.CharField(max_length=7, validators=[_color_validator], verbose_name='Цвет №4')
    description = models.TextField(verbose_name='Описание')
    is_available = models.BooleanField(verbose_name='Доступен ли')
    background = models.FileField(upload_to='styles/', verbose_name='Фон')

    def __str__(self):
        return f'{self.name} ({self.pk})'
