from datetime import datetime
from decimal import Decimal
from clicker.celery import app
from clicks.models import Click
from users.models import ClickTransaction


@app.task
def handle_click(user_id, date_time, value_str, count=1):
    date_time = datetime.fromtimestamp(date_time / 1000)
    value = Decimal(value_str)
    clicks = list()
    for _ in range(count):
        click = Click(
            user_id=user_id,
            value=value,
            created_at=date_time
        )
        clicks.append(click)
    Click.objects.bulk_create(clicks)
    for click in clicks:
        ClickTransaction.objects.create(
            user_id=user_id,
            date=date_time,
            value=value,
            click=click
        )
