FROM python:3.11

# python envs
ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

# python dependencies
COPY ./requirements.txt /
RUN pip install -r ./requirements.txt

COPY ./scripts/entrypoint.sh ./scripts/start.sh ./scripts/gunicorn.sh ./scripts/start_celery.sh /
# upload scripts

# Fix windows docker bug, convert CRLF to LF
RUN sed -i 's/\r$//g' /start.sh && chmod +x /start.sh && sed -i 's/\r$//g' /entrypoint.sh && chmod +x /entrypoint.sh &&\
    sed -i 's/\r$//g' /gunicorn.sh && chmod +x /gunicorn.sh && sed -i 's/\r$//g' /start_celery.sh && chmod +x /start_celery.sh

WORKDIR /app
