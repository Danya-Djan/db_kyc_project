#!/usr/bin/env bash

for i in {0..$CELERY_WORKER_COUNT}
do
  celery -A clicker worker -l info --concurrency=10 -n worker$i@%h
done

