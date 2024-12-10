from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import transaction
from users.models import MailingList
from users.celery import check_mailing_lists


@receiver(post_save, sender=MailingList, dispatch_uid='mailing_list_signal')
def mailing_list_signal(sender, instance, created, **kwargs):
    if not created:
        return
    transaction.on_commit(lambda: check_mailing_lists.delay())