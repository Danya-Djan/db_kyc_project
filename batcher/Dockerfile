FROM python:3.12

WORKDIR /batcher

COPY ./requirements.txt /batcher/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /batcher/requirements.txt

COPY ./app /batcher/app

CMD ["fastapi", "run", "app/main.py", "--port", "$HTTP_PORT"]