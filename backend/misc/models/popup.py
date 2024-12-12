from django.db import models


class PopupReceiverInfo(models.Model):
    class Meta:
        verbose_name = 'Информация о получателе попапа'
        verbose_name_plural = 'Информация о получателях рассылки'

    popup = models.ForeignKey('misc.Popup', on_delete=models.CASCADE,
                              related_name='popup_receiver_infos', verbose_name='Рассылка')
    user = models.ForeignKey('users.TGUser', on_delete=models.CASCADE,
                             related_name='popup_receiver_infos', verbose_name='Пользователь')
    viewed = models.BooleanField(default=False, verbose_name='Просмотрен ли')


class Popup(models.Model):
    class Meta:
        verbose_name = 'Попап'
        verbose_name_plural = 'Попап'

    name = models.CharField(max_length=250, verbose_name='Название')
    text = models.TextField(verbose_name='Текст публикации')
    media = models.FileField(upload_to='popup/', verbose_name='Обложка')
    users = models.ManyToManyField('users.TGUser', related_name='popups', through='misc.PopupReceiverInfo',
                                   verbose_name='Пользователи')
    button = models.ForeignKey('misc.Button', related_name='popups', on_delete=models.CASCADE,
                               null=True, blank=True,
                               verbose_name='Кнопка')

    def __str__(self):
        return f'Попап {self.name} от {self.time.strftime("%d.%m.%Y")} №{self.id}'

