from decimal import Decimal
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from django.db.models import F
from django.db.models.functions import Least
from users.models import TGUser, ClickTransaction
from misc.models import Setting


@receiver(post_save, sender=ClickTransaction, dispatch_uid='referral_transaction_signal')
def referral_signal(sender, instance, created, **kwargs):
    if not created:
        return
    if referred_by_user := instance.user.referred_by:
        referred_by_user.referral_storage = Least(
            F('referral_storage') + instance.value * Decimal(Setting.objects.get(name='REFERRAL_PERCENT').value['value']),
            referred_by_user.max_storage
        )
        referred_by_user.save()
    for referree in instance.user.referrees.all():
        referree.referral_storage = Least(
            F('referral_storage') + instance.value * Decimal(Setting.objects.get(name='REVERSE_REFERRAL_PERCENT').value['value']),
            referree.max_storage
        )
        referree.save()

