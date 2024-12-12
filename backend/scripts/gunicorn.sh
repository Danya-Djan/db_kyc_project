#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

python manage.py migrate
python manage.py collectstatic --noinput --verbosity 0
gunicorn clicker.wsgi -b 0.0.0.0:8000 -w 17 --timeout 600 --chdir=/app --access-logfile -
