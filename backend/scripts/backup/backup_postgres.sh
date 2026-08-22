#!/usr/bin/env bash
# HealthDoc Postgres backup — issue #244 (BB-W7-02).
#
# Runs pg_dump against the project's Postgres. Uses `docker exec` into the
# compose container when it is running (local dev), and connects over
# host/port otherwise — CI runs Postgres as a service container with no
# compose name, and a deployed database may be managed with no container.
#
# Usage (from repo root or backend/, doesn't matter — paths are relative
# to this script's own location):
#   ./scripts/backup/backup_postgres.sh [output_dir]
#
# Reads DB name/user from .env at the repo root when present (the same file
# docker-compose uses, so it never drifts from what is running), and from
# exported environment variables otherwise.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
CONTAINER_NAME="${POSTGRES_CONTAINER:-healthdoc-postgres-1}"
OUTPUT_DIR="${1:-$REPO_ROOT/backups}"

# .env is a local-development convenience, not a requirement. CI has no .env
# (secrets are not committed) and a deployed container has none either — in both
# places configuration arrives as exported environment variables. Requiring the
# file made this script unusable in exactly the two environments that matter
# most for a backup: the pipeline that proves it works, and production.
#
# Already-exported variables win: sourcing does not clobber an explicit
# POSTGRES_DB passed by the caller.
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

mkdir -p "$OUTPUT_DIR"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP_FILE="$OUTPUT_DIR/healthdoc_${POSTGRES_DB}_${TIMESTAMP}.dump"

echo "Backing up '$POSTGRES_DB' from $PG_TARGET ..."

# -F c: custom format — compressed, and required for pg_restore's
# selective/parallel restore options used by restore_postgres.sh.
# --no-owner/--no-privileges: dev/staging dumps shouldn't carry role
# grants tied to this specific Postgres instance's role names, which
# may not exist identically on the restore target.
run_pg pg_dump \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -F c \
    --no-owner \
    --no-privileges \
    > "$DUMP_FILE"

SIZE=$(du -h "$DUMP_FILE" | cut -f1)
echo "Backup complete: $DUMP_FILE ($SIZE)"

# Verify the dump is structurally readable before calling this a success —
# a truncated/corrupt dump file that "succeeded" (exit 0) but can't be
# listed is worse than a loud failure, since it would only be discovered
# at restore time, possibly during an actual incident.
if ! run_pg pg_restore --list < "$DUMP_FILE" > /dev/null 2>&1; then
    echo "ERROR: backup file failed integrity check (pg_restore --list). Not safe to rely on." >&2
    exit 1
fi
echo "Integrity check passed (pg_restore --list)."