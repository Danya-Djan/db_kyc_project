import datetime
import decimal
import pydantic


class Click(pydantic.BaseModel):
    userId: int
    dateTime: datetime.datetime
    value: decimal.Decimal
