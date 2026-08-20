#!/usr/bin/env bash
# HealthDoc Postgres restore — issue #244 (BB-W7-02). Companion to
# backup_postgres.sh; see that file's header for the container/env
# assumptions, which are identical here.
#
# Usage:
#   ./scripts/backup/restore_postgres.sh <dump_file> [target_db_name]
#
# target_db_name defaults to POSTGRES_DB from .env. Pass an explicit
# name (e.g. healthdoc_restore_test) to restore into a NEW database
# instead of overwriting the live one — this is the safer default for
# actually verifying a backup works, and is what the #244 acceptance
# criteria ("tests written and passing") should exercise: restore into
# a throwaway DB, assert row counts / a known row exists, drop it.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
CONTAINER_NAME="${POSTGRES_CONTAINER:-healthdoc-postgres-1}"

DUMP_FILE="${1:?Usage: restore_postgres.sh <dump_file> [target_db_name]}"
if [ ! -f "$DUMP_FILE" ]; then
    echo "ERROR: dump file not found: $DUMP_FILE" >&2
    exit 1
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a
: "${POSTGRES_USER:?POSTGRES_USER not set in .env}"
: "${POSTGRES_DB:?POSTGRES_DB not set in .env}"

TARGET_DB="${2:-$POSTGRES_DB}"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    echo "ERROR: container '$CONTAINER_NAME' is not running." >&2
    exit 1
fi

if [ "$TARGET_DB" = "$POSTGRES_DB" ]; then
    echo "WARNING: restoring into the LIVE database '$POSTGRES_DB'. This will overwrite existing data."
    read -r -p "Type the database name to confirm: " CONFIRM
    if [ "$CONFIRM" != "$POSTGRES_DB" ]; then
        echo "Confirmation did not match. Aborting." >&2
        exit 1
    fi
fi

# Create the target DB if it doesn't already exist (needed for the
# throwaway-restore-target pattern the header comment recommends).
DB_EXISTS=$(docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -tAc \
    "SELECT 1 FROM pg_database WHERE datname='$TARGET_DB'")
if [ "$DB_EXISTS" != "1" ]; then
    echo "Creating database '$TARGET_DB' ..."
    docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "CREATE DATABASE \"$TARGET_DB\";"
fi

echo "Restoring '$DUMP_FILE' into '$TARGET_DB' ..."
# --clean --if-exists: safe to re-run against a DB that already has
# some/all of these objects (e.g. re-restoring into the same throwaway
# target during iterative testing) without manual cleanup between runs.
docker exec -i "$CONTAINER_NAME" pg_restore \
    -U "$POSTGRES_USER" \
    -d "$TARGET_DB" \
    --clean --if-exists --no-owner --no-privileges \
    < "$DUMP_FILE"

echo "Restore complete into '$TARGET_DB'."