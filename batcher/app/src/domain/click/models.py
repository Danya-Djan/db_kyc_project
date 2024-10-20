import datetime
import decimal
import pydantic


class Click(pydantic.BaseModel):
    UserID: int
    DateTime: datetime.datetime
    Value: decimal.Decimal
