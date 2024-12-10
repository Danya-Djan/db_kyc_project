#!/usr/bin/env bash

set -o errexit
set -o pipefail
cmd="$@"

function postgres_ready(){
python << END
import sys
import os
import psycopg2

try:
    dbname = os.getenv('POSTGRES_DB')
    user = os.getenv('POSTGRES_USER')
    password = os.getenv('POSTGRES_PASSWORD')
    host = os.getenv('DB_HOST', 'postgres')
    port = os.getenv('POSTGRES_PORT', '5432')
    conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)
END
}

until postgres_ready; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - continuing..."
exec $cmd
