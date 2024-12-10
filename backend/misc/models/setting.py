from django.db import models


class Setting(models.Model):
    class Meta:
        verbose_name = 'Настройка'
        verbose_name_plural = 'Настройки'

    name = models.CharField(max_length=250, verbose_name='Машиночитаемое название',
                            help_text='Желательно в формате: SAMPLE_NAME')
    description = models.TextField(verbose_name='Описание')
    value = models.JSONField(verbose_name='Значение')

    @property
    def display_value(self):
        return self.value['value']
    display_value.fget.short_description = 'Значение'

    def __str__(self):
        return f'{self.name} ({self.pk})'
