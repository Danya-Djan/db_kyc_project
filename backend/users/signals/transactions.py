from decimal import Decimal
from django.dispatch import receiver
from django.db import transaction
from django.db.models import F
from django.db.models.signals import post_save, pre_save, pre_delete
from users.models import Transaction, ClickTransaction
from users.errors import NotEnoughFundsError
from misc.models import Setting


@receiver(pre_save, dispatch_uid='transaction_pre_save_signal')
def transaction_pre_save_signal(sender, instance, **kwargs):
    if not isinstance(instance, Transaction) or not instance.pk:
        return
    transaction_instance = Transaction.objects.get(pk=instance.id)
    instance._old_value = transaction_instance.value


@receiver(post_save, dispatch_uid='transaction_signal')
def transaction_signal(sender, instance, created, **kwargs):
    if not issubclass(sender, Transaction):
        return
    with transaction.atomic():
        user_instance = instance.user
        user_instance.points = F('points') + (instance.value - getattr(instance, '_old_value', 0))
        user_instance.save()
        user_instance.refresh_from_db()
        if user_instance.points < 0:
            raise NotEnoughFundsError


@receiver(pre_delete, dispatch_uid='transaction_pre_delete_signal')
def transaction_pre_delete_signal(sender, instance, **kwargs):
    if not issubclass(sender, Transaction):
        return
    with transaction.atomic():
        user_instance = instance.user
        user_instance.points = F('points') - instance.value
        user_instance.save()
        user_instance.refresh_from_db()
        if user_instance.points < 0:
            raise NotEnoughFundsError
