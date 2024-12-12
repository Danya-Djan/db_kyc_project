from django.db import models
from users.choices import MailingListStatus


class MailingListReceiverInfo(models.Model):
    class Meta:
        verbose_name = 'Информация о получателе рассылки'
        verbose_name_plural = 'Информация о получателях рассылки'

    mailing_list = models.ForeignKey('users.MailingList', on_delete=models.CASCADE,
                                     related_name='mailing_list_receiver_infos', verbose_name='Рассылка')
    user = models.ForeignKey('users.TGUser', on_delete=models.CASCADE,
                             related_name='mailing_list_receiver_infos', verbose_name='Пользователь')
    sent = models.BooleanField(default=False, verbose_name='Отправлена ли')
    clicked = models.BooleanField(default=False, verbose_name='Нажата ли')


class MailingList(models.Model):
    class Meta:
        verbose_name = 'Рассылка'
        verbose_name_plural = 'Рассылки'

    name = models.CharField(max_length=250, verbose_name='Название')
    time = models.DateTimeField(verbose_name='Дата и время публикации')
    text = models.TextField(verbose_name='Текст публикации')
    media = models.FileField(upload_to='mailing/', verbose_name='Вложение')
    users = models.ManyToManyField('users.TGUser', related_name='mailing_lists',
                                   through='users.MailingListReceiverInfo',
                                   verbose_name='Пользователи')
    status = models.CharField(max_length=1, choices=MailingListStatus.choices, default=MailingListStatus.WAITING,
                              verbose_name='Статус')
    main_button = models.ForeignKey('misc.Button', on_delete=models.CASCADE,
                                    related_name='mailing_lists_for_main_button',
                                    null=True, blank=True,
                                    verbose_name='Кнопка')
    webapp_button = models.ForeignKey('misc.Button', on_delete=models.CASCADE,
                                      null=True, blank=True,
                                      related_name='mailing_lists_for_webapp_button', verbose_name='Кнопка с веб-аппом')

    def __str__(self):
        return f'Рассылка {self.name} от {self.time.strftime("%d.%m.%Y")} №{self.id}'

