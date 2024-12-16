#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

gunicorn main_api:app -w 17 -b 0.0.0.0:7313 -k uvicorn.workers.UvicornWorker --timeout 600
