#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

uvicorn main_api:app --host 0.0.0.0 --port 7313 --log-config /app/log.ini