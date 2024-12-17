FROM python:3.12

WORKDIR /batcher

COPY ./ /batcher

RUN pip install --no-cache-dir --upgrade -r /batcher/requirements.txt

ENV PYTHONPATH="${PYTHONPATH}:/batcher/app"

CMD uvicorn app.main:app --host 0.0.0.0 --port "${HTTP_PORT}"
