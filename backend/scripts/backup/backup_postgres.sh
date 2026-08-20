#!/usr/bin/env bash
# HealthDoc Postgres backup — issue #244 (BB-W7-02).
#
# Wraps `docker exec ... pg_dump` against the postgres service defined in
# infra/docker-compose.yml (container name from `docker ps`, not guessed —
# confirmed as healthdoc-postgres-1 throughout the #243 work this session).
#
# Usage (from repo root or backend/, doesn't matter — paths are relative
# to this script's own location):
#   ./scripts/backup/backup_postgres.sh [output_dir]
#
# Reads DB name/user from .env at the repo root (same file docker-compose
# already uses), so it never drifts from what's actually running.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
CONTAINER_NAME="${POSTGRES_CONTAINER:-healthdoc-postgres-1}"
OUTPUT_DIR="${1:-$REPO_ROOT/backups}"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE not found. Run from a checkout with .env configured." >&2
    exit 1
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

: "${POSTGRES_USER:?POSTGRES_USER not set in .env}"
: "${POSTGRES_DB:?POSTGRES_DB not set in .env}"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    echo "ERROR: container '$CONTAINER_NAME' is not running. Start it with:" >&2
    echo "  docker compose -f infra/docker-compose.yml --env-file .env up -d postgres" >&2
    exit 1
fi

mkdir -p "$OUTPUT_DIR"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP_FILE="$OUTPUT_DIR/healthdoc_${POSTGRES_DB}_${TIMESTAMP}.dump"

echo "Backing up '$POSTGRES_DB' from container '$CONTAINER_NAME' ..."

# -F c: custom format — compressed, and required for pg_restore's
# selective/parallel restore options used by restore_postgres.sh.
# --no-owner/--no-privileges: dev/staging dumps shouldn't carry role
# grants tied to this specific Postgres instance's role names, which
# may not exist identically on the restore target.
docker exec -i "$CONTAINER_NAME" pg_dump \
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
if ! docker exec -i "$CONTAINER_NAME" pg_restore --list < "$DUMP_FILE" > /dev/null 2>&1; then
    echo "ERROR: backup file failed integrity check (pg_restore --list). Not safe to rely on." >&2
    exit 1
fi
echo "Integrity check passed (pg_restore --list)."