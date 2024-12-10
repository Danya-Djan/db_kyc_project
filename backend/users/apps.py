from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        from .signals import (
            transaction_signal, transaction_pre_delete_signal, transaction_pre_save_signal, referral_signal,
            mailing_list_signal,
        )
        from .celery import handle_mailing_list, check_mailing_lists
