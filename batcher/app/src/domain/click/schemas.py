import decimal

import pydantic

from .models import Click


class ClickResponse(pydantic.BaseModel):
    click: Click
    energy: int


class ClickValueResponse(pydantic.BaseModel):
    value: decimal.Decimal


class BatchClickRequest(pydantic.BaseModel):
    count: int
