from rest_framework.exceptions import APIException


class NotEnoughFundsError(APIException):
    status_code = 400
    default_detail = 'Невозможно выполнить операцию, недостаточно баллов'
    default_code = 'bad_request'
