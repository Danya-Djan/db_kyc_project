from django.db.models import F
from django.db.models.functions import RowNumber
from django.db.models.expressions import Window
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from django_cte import With
from users.serializers import TGUserSerializer
from users.models import TGUser
from misc.models import Setting


@api_view(['GET'])
def top(request):
    limit = int(request.query_params.get('limit', Setting.objects.get(name='DEFAULT_TOP_LIMIT').value['value']))
    qs = (
        TGUser.objects.order_by('-points', 'user_id')
        .annotate(row_number=Window(expression=RowNumber(), order_by=[-F('points'), F('user_id')]))[:limit]
    )
    serializer = TGUserSerializer(qs, many=True)
    return Response(status=HTTP_200_OK, data=serializer.data)


@api_view(['GET'])
def neighbours(request):
    limit = int(request.query_params.get('limit', Setting.objects.get(name='DEFAULT_NEIGHBOUR_LIMIT').value['value']))
    cte = With(
        TGUser.objects.annotate(row_number=Window(expression=RowNumber(), order_by=[-F('points'), F('user_id')])))
    full_qs = cte.join(TGUser, tg_id=cte.col.tg_id).with_cte(cte).annotate(row_number=cte.col.row_number)
    self = full_qs.get(pk=request.user.tg_user.pk)
    qs = (
        full_qs.filter(pk=request.user.tg_user.pk)
        .union(full_qs.filter(row_number__lt=self.rank).order_by('points', '-user_id')[:limit])
        .union(full_qs.filter(row_number__gt=self.rank).order_by('-points', 'user_id')[:limit])
        .order_by('-points', 'user_id')
    )
    serializer = TGUserSerializer(qs, many=True)
    return Response(status=HTTP_200_OK, data=serializer.data)

@api_view(['GET'])
def friends(request):
    cte = With(
        TGUser.objects.annotate(row_number=Window(expression=RowNumber(), order_by=[-F('points'), F('user_id')])))
    full_qs = cte.join(TGUser, tg_id=cte.col.tg_id).with_cte(cte).annotate(row_number=cte.col.row_number)
    self = full_qs.get(pk=request.user.tg_user.pk)
    qs = (
        full_qs.filter(pk=request.user.tg_user.pk)
        .union(full_qs.filter(referred_by_id=self.pk).order_by('points', '-user_id'))
        .order_by('-points', 'user_id')
    )
    serializer = TGUserSerializer(qs, many=True)
    return Response(status=HTTP_200_OK, data=serializer.data)

