from django.urls import path
from users.views import get_token, check_registration

urlpatterns = [
    path('get-token/<int:pk>', get_token),
    path('check/<int:pk>', check_registration),
]
