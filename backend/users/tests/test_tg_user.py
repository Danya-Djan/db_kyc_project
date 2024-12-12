import pytest
from decimal import Decimal
from pytest_drf import (
    ViewSetTest,
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
from pytest_drf.util import url_for
from pytest_lambda import lambda_fixture, static_fixture
from django.contrib.auth.models import User
from users.models import TGUser

user = lambda_fixture(lambda: TGUser.objects.create(
    user=User.objects.create_user(
        username='test_user',
        password='test_pass'
    ),
    tg_id=1,
    username='test_user',
).user)


@pytest.mark.django_db
class TestTGUserViewSet(ViewSetTest):
    detail_url = lambda_fixture(
        lambda user:
        url_for('user-detail', user.tg_user.pk)
    )

    class TestGet(
        UsesDetailEndpoint,
        UsesGetMethod,
        Returns200,
        AsUser('user')
    ):
        pass

    class TestUpdate(
        UsesDetailEndpoint,
        UsesPatchMethod,
        Returns200,
        AsUser('user')
    ):
        pass

    class TestUpdateDisallowed(
        UsesPatchMethod,
        Returns403,
        AsUser('user')
    ):
        another_user = lambda_fixture(
            lambda: TGUser.objects.create(
                user=User.objects.create_user(
                    username='another_user',
                    password='another_pass'
                ),
                tg_id=2,
                username='another_user',
            )
        )
        url = lambda_fixture(lambda: url_for('user-detail', 2))
        data = static_fixture({
            'username': 'new_name'
        })

        def test_it_returns_403(self, another_user, response, expected_status_code):
            super().test_it_returns_403(response, expected_status_code)

    class TestDelete(
        UsesDetailEndpoint,
        UsesDeleteMethod,
        Returns204,
        AsUser('user'),
    ):
        pass

    class TestDeleteDisallowed(
        UsesDeleteMethod,
        Returns403,
        AsUser('user'),
    ):
        another_user = lambda_fixture(
            lambda: TGUser.objects.create(
                user=User.objects.create_user(
                    username='another_user',
                    password='another_pass'
                ),
                tg_id=2,
                username='another_user',
            )
        )
        url = lambda_fixture(lambda: url_for('user-detail', 2))

        def test_it_returns_403(self, another_user, response, expected_status_code):
            super().test_it_returns_403(response, expected_status_code)
