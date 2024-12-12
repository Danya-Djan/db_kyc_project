from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class MailingListStatus(TextChoices):
    WAITING = '1', _('Ожидание')
    QUEUED = '2', _('В очереди')
    PROCESSING = '3', _('В обработке')
    PARTLY_FINISHED = '4', _('Окончена с ошибками')
    FINISHED = '5', _('Завершена')
