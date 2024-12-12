import pytest
from decimal import Decimal
from pytest_drf import (
    ViewSetTest,
    APIViewTest,
    AsUser,
    Returns200,
    Returns403,
    Returns204,
    UsesGetMethod,
    UsesDeleteMethod,
    UsesDetailEndpoint,
    UsesListEndpoint,
    UsesPatchMethod,
    UsesPostMethod,
)
from django.utils.html import urlencode
from pytest_drf.util import url_for
from pytest_lambda import lambda_fixture, static_fixture
from django.contrib.auth.models import User
from users.models import TGUser
from misc.models import Setting

user = lambda_fixture(lambda: TGUser.objects.create(
    user=User.objects.create_user(
        username='test_user',
        password='test_pass'
    ),
    tg_id=1,
    points=250,
    username='test_user',
).user)
other_users = lambda_fixture(lambda: list(TGUser.objects.create(
    user=User.objects.create(
        username=f'user-{i}',
        password=f'user-{i}'
    ),
    tg_id=i * 100,
    points=i * 100,
    referred_by_id=1,
    username=f'user-{i}'
) for i in range(1, 5)))
max_storage_setting = lambda_fixture(lambda: Setting.objects.create(name='MAX_STORAGE', value={'value': 200}))


@pytest.mark.django_db
class TestTop(APIViewTest, AsUser('user')):
    url = lambda_fixture(lambda: url_for('rank-top') + '?' + urlencode({'limit': 3}))
    top_setting = lambda_fixture(lambda: Setting.objects.create(name='DEFAULT_TOP_LIMIT', value={'value': 25}))

    def test_top(self, other_users, top_setting, max_storage_setting, json):
        for user_data in json:
            user_data.pop('created_at')
        expected = [
            {
                'tg_id': 400,
                'username': 'user-4',
                'avatar': None,
                'referred_by': 1,
                'points': '400.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 1,
            },
            {
                'tg_id': 300,
                'username': 'user-3',
                'avatar': None,
                'referred_by': 1,
                'points': '300.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 2,
            },
            {
                'tg_id': 1,
                'username': 'test_user',
                'avatar': None,
                'referred_by': None,
                'points': '250.00',
                'referral_storage': '0.00000',
                'max_storage': '1000.00',
                'rank': 3,
            }
        ]
        assert expected == json


@pytest.mark.django_db
class TestNeighbours(APIViewTest, AsUser('user')):
    url = lambda_fixture(lambda: url_for('rank-neighbours') + '?' + urlencode({'limit': 1}))
    neighbour_setting = lambda_fixture(lambda: Setting.objects.create(name='DEFAULT_NEIGHBOUR_LIMIT', value={'value': 25}))

    def test_neighbours(self, other_users, neighbour_setting, max_storage_setting, json):
        for user_data in json:
            user_data.pop('created_at')
        expected = [
            {
                'tg_id': 300,
                'username': 'user-3',
                'avatar': None,
                'referred_by': 1,
                'points': '300.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 2,
            },
            {
                'tg_id': 1,
                'username': 'test_user',
                'avatar': None,
                'referred_by': None,
                'points': '250.00',
                'referral_storage': '0.00000',
                'max_storage': '1000.00',
                'rank': 3,
            },
            {
                'tg_id': 200,
                'username': 'user-2',
                'avatar': None,
                'referred_by': 1,
                'points': '200.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 4,
            },
        ]
        assert expected == json


@pytest.mark.django_db
class TestFriends(APIViewTest, AsUser('user')):
    url = lambda_fixture(lambda: url_for('rank-friends'))

    def test_friends(self, other_users, max_storage_setting, json):
        for user_data in json:
            user_data.pop('created_at')
        expected = [
            {
                'tg_id': 400,
                'username': 'user-4',
                'avatar': None,
                'referred_by': 1,
                'points': '400.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 1,
            },
            {
                'tg_id': 300,
                'username': 'user-3',
                'avatar': None,
                'referred_by': 1,
                'points': '300.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 2,
            },
            {
                'tg_id': 1,
                'username': 'test_user',
                'avatar': None,
                'referred_by': None,
                'points': '250.00',
                'referral_storage': '0.00000',
                'max_storage': '1000.00',
                'rank': 3,
            },
            {
                'tg_id': 200,
                'username': 'user-2',
                'avatar': None,
                'referred_by': 1,
                'points': '200.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 4,
            },
            {
                'tg_id': 100,
                'username': 'user-1',
                'avatar': None,
                'referred_by': 1,
                'points': '100.00',
                'referral_storage': '0.00000',
                'max_storage': '200.00',
                'rank': 5,
            },
        ]
        assert expected == json
