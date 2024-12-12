from django.dispatch import receiver
from django.db.models.signals import post_save
from misc.models import Setting
from misc.celery import deliver_setting as deliver_setting_celery


@receiver(post_save, sender=Setting, dispatch_uid='deliver_setting')
def deliver_setting(sender, instance, **kwargs):
    deliver_setting_celery.delay(instance.name)
