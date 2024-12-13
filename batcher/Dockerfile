FROM python:3.12

WORKDIR /batcher

COPY ./requirements.txt /batcher/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /batcher/requirements.txt

COPY ./app /batcher/app

ENV PYTHONPATH="${PYTHONPATH}:/batcher/app"

CMD uvicorn app.main:app --host 0.0.0.0 --port "${HTTP_PORT}"