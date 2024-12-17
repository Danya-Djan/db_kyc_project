#!/bin/sh

for i in $(seq 1 "${CELERY_WORKER_COUNT}"); do
  celery -A clicker worker -l info --concurrency=10 -n "worker${i}@$(%h)"
done

celery -A clicker beat -l info
