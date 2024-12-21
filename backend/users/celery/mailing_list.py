from clicker.celery import app
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import requests
from users.choices import MailingListStatus
from users.models import MailingList, MailingListReceiverInfo


@app.task
def handle_mailing_list(mailing_list_id):
    mailing_list = MailingList.objects.select_related('main_button', 'webapp_button').get(pk=mailing_list_id)
    mailing_list.status = MailingListStatus.PROCESSING
    mailing_list.save(update_fields=('status',))
    mailing_list_receiver_infos = (
        MailingListReceiverInfo.objects
        .filter(mailing_list_id=mailing_list.pk)
        .exclude(sent=True)
    )
    no_errors = True
    for mailing_list_receiver_info in mailing_list_receiver_infos:
        if mailing_list_receiver_info.sent:
            continue
        user = mailing_list_receiver_info.user
        body = {
            'tg_id': user.tg_id,
            'text': mailing_list.text,
            'attachment_path': mailing_list.media.url,
            'button_name': mailing_list.main_button.text if mailing_list.main_button else '',
            'button_url': mailing_list.main_button.link if mailing_list.main_button else '',
            'web_app_button_name': mailing_list.webapp_button.text if mailing_list.webapp_button else '',
            'spam_id': mailing_list.pk,
        }
        response = requests.post('http://bot:7313/dispatch/', json=body)
        if response.status_code == 200:
            mailing_list_receiver_info.sent = True
            mailing_list_receiver_info.save()
        else:
            no_errors = False
    if no_errors:
        mailing_list.status = MailingListStatus.FINISHED
    else:
        mailing_list.status = MailingListStatus.PARTLY_FINISHED
    mailing_list.save(update_fields=('status',))


@app.task
def check_mailing_lists():
    for mailing_list in MailingList.objects.filter(time__lte=timezone.now() + timedelta(hours=1), status__in=[MailingListStatus.WAITING, MailingListStatus.PARTLY_FINISHED]):
        mailing_list.status = MailingListStatus.QUEUED
        mailing_list.save(update_fields=('status',))
        handle_mailing_list.apply_async(
            (mailing_list.pk,),
            eta=mailing_list.time
        )
