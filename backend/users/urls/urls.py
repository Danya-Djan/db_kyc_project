from django.urls import include, path
from rest_framework.routers import SimpleRouter
from users.views import (
    TGUserViewSet, empty_storage, top as rank_top, neighbours as rank_neighbours, friends as rank_friends, warn
)

router = SimpleRouter()
router.register('', TGUserViewSet, 'user')

urlpatterns = [
    path('empty-storage/', empty_storage),
    path('', include(router.urls)),
    path('warn/', warn, name='warn'),
    path('rank/top', rank_top, name='rank-top'),
    path('rank/neighbours', rank_neighbours, name='rank-neighbours'),
    path('rank/friends', rank_friends, name='rank-friends'),
]
