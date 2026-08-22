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

# .env is a local-development convenience, not a requirement — see the note in
# backup_postgres.sh. Already-exported variables win over the file.
if [ -f "$ENV_FILE" ]; then
    _PRESET_USER="${POSTGRES_USER:-}"
    _PRESET_DB="${POSTGRES_DB:-}"
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE"; set +a
    [ -n "$_PRESET_USER" ] && POSTGRES_USER="$_PRESET_USER"
    [ -n "$_PRESET_DB" ] && POSTGRES_DB="$_PRESET_DB"
fi

: "${POSTGRES_USER:?POSTGRES_USER not set — export it or provide .env at the repo root}"
: "${POSTGRES_DB:?POSTGRES_DB not set — export it or provide .env at the repo root}"

TARGET_DB="${2:-$POSTGRES_DB}"

# How to reach Postgres.
#
# docker exec into the compose container when it is running (local dev);
# otherwise talk to a host/port directly. CI runs Postgres as a service
# container on localhost:5432 with no compose name, and a deployed database is
# frequently managed with no container at all — the docker-only path made these
# scripts unusable in both of the places a backup matters most: the pipeline
# that proves it works, and production.
PGHOST_EFFECTIVE="${PGHOST:-${POSTGRES_HOST:-localhost}}"
PGPORT_EFFECTIVE="${PGPORT:-${POSTGRES_PORT:-5432}}"

if docker ps --format '{{.Names}}' 2>/dev/null | grep -qx "$CONTAINER_NAME"; then
    PG_MODE="docker"
    PG_TARGET="container '$CONTAINER_NAME'"
else
    PG_MODE="direct"
    PG_TARGET="$PGHOST_EFFECTIVE:$PGPORT_EFFECTIVE"
    if ! command -v pg_dump >/dev/null 2>&1; then
        echo "ERROR: container '$CONTAINER_NAME' is not running and the PostgreSQL" >&2
        echo "client tools are not on PATH. Either start the stack:" >&2
        echo "  docker compose -f infra/docker-compose.yml --env-file .env up -d postgres" >&2
        echo "or install postgresql-client to reach a remote database." >&2
        exit 1
    fi
fi

# Runs one client tool against whichever target was selected. The client
# version must be >= the server version for pg_dump; a mismatch fails loudly
# here rather than producing a dump that cannot be restored.
run_pg() {
    local tool="$1"; shift
    if [ "$PG_MODE" = "docker" ]; then
        docker exec -i "$CONTAINER_NAME" "$tool" "$@"
    else
        PGPASSWORD="${POSTGRES_PASSWORD:-}" "$tool" \
            -h "$PGHOST_EFFECTIVE" -p "$PGPORT_EFFECTIVE" "$@"
    fi
}

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
DB_EXISTS=$(run_pg psql -U "$POSTGRES_USER" -tAc \
    "SELECT 1 FROM pg_database WHERE datname='$TARGET_DB'")
if [ "$DB_EXISTS" != "1" ]; then
    echo "Creating database '$TARGET_DB' ..."
    run_pg psql -U "$POSTGRES_USER" -c "CREATE DATABASE \"$TARGET_DB\";"
fi

echo "Restoring '$DUMP_FILE' into '$TARGET_DB' ..."
# --clean --if-exists: safe to re-run against a DB that already has
# some/all of these objects (e.g. re-restoring into the same throwaway
# target during iterative testing) without manual cleanup between runs.
run_pg pg_restore \
    -U "$POSTGRES_USER" \
    -d "$TARGET_DB" \
    --clean --if-exists --no-owner --no-privileges \
    < "$DUMP_FILE"

echo "Restore complete into '$TARGET_DB'."