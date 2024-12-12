from django.apps import AppConfig


class MiscConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "misc"

    def ready(self):
        from .celery import deliver_setting as deliver_setting_celery
        from .signals import deliver_setting
        from misc.models import Setting

        for setting in Setting.objects.all():
            deliver_setting_celery.delay(setting.name)
