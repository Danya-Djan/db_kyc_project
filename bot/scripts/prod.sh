#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

gunicorn main_api:app -w "${WORKER_COUNT}" -b "0.0.0.0:${HTTP_PORT}" -k uvicorn.workers.UvicornWorker --timeout 600
