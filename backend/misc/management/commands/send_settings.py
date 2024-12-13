from django.core.management.base import BaseCommand, CommandError
from misc.celery import deliver_setting
from misc.models import Setting

class Command(BaseCommand):
    help = 'Sends all settings to rmq for batcher to consume'

    def handle(self, *args, **options):
        for setting in Setting.objects.all():
            deliver_setting.delay(setting.name)
