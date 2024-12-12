from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from users.models import ReferralTransaction


@transaction.atomic
@api_view(['POST'])
def empty_storage(request):
    tg_user = request.user.tg_user
    if tg_user.referral_storage == 0:
        return Response(data={'points': str(tg_user.points)})
    ReferralTransaction.objects.create(
        user_id=tg_user.pk,
        value=tg_user.referral_storage
    )
    tg_user.refresh_from_db()
    tg_user.referral_storage = 0
    tg_user.save()
    tg_user.refresh_from_db()
    return Response(data={'points': str(tg_user.points)})
