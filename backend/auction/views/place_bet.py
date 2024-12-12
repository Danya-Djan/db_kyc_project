from decimal import Decimal
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.decorators import api_view
from rest_framework.exceptions import ParseError
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from django_cte import With
from auction.models import Auction, Bet


@api_view(['POST'])
def place_bet(request, pk):
    auction = get_object_or_404(Auction, pk=pk)
    if not auction.is_active:
        raise ParseError('Аукцион уже закончился')
    bet_value = Decimal(request.query_params.get('value', 0))
    if bet_value <= 0:
        raise ParseError('Ставка должна быть положительная')
    if bet_value < auction.min_bet_value:
        raise ParseError('Ставка слишком маленькая')
    tg_user = request.user.tg_user
    auction_has_to_be_postponed = timezone.now() <= auction.end_time <= timezone.now() + auction.last_call_delta
    with transaction.atomic():
        cte = With(auction.bets.filter(_is_winning=True).distinct('user').order_by('user_id'))
        winning_bets = cte.join(Bet, id=cte.col.id).with_cte(cte).order_by('-_value')
        commission_value = bet_value * auction.commission

        if winning_bets.filter(user_id=tg_user.pk).exists():
            user_bet = winning_bets.get(user_id=tg_user.pk)
            delta = bet_value - user_bet.value
            user_bet.transaction.refund()
            commission_value = delta * auction.commission
        elif winning_bets.count() >= auction.quantity:
            for bet in winning_bets[auction.quantity - 1:]:
                bet.transaction.refund()

        Bet.objects.create_with_transaction_and_commission(
            auction=auction,
            user=tg_user,
            value=bet_value,
            commission_value=commission_value
        )
        if auction_has_to_be_postponed:
            auction.times_postponed = F('times_postponed') + 1
            auction.save(update_fields=('times_postponed',))
    tg_user.refresh_from_db()
    return Response(status=HTTP_200_OK, data={'remaining_points': tg_user.points})
