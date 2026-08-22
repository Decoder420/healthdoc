#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-${PROJECT_ROOT}/.env}"
if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}; copy .env.example to .env first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

RUN_DB="${MIGRATION_REHEARSAL_DB:-healthdoc_rehearsal_0002_0046}"
RESTORE_DB="${MIGRATION_RESTORE_DB:-healthdoc_rehearsal_restore_0046}"
ARTIFACT_DIR="${MIGRATION_ARTIFACT_DIR:-/private/tmp/healthdoc-migration-rehearsal-$(date -u +%Y%m%dT%H%M%SZ)}"
SOURCE_DUMP="${SOURCE_DUMP:-}"
KEEP_DATABASES="${KEEP_DATABASES:-0}"

for db_name in "${RUN_DB}" "${RESTORE_DB}"; do
  if [[ ! "${db_name}" =~ ^healthdoc_rehearsal_[a-zA-Z0-9_]+$ ]]; then
    echo "Refusing database name outside the healthdoc_rehearsal_* safety prefix: ${db_name}" >&2
    exit 1
  fi
done
if [[ "${RUN_DB}" == "${POSTGRES_DB}" || "${RESTORE_DB}" == "${POSTGRES_DB}" ]]; then
  echo "Refusing to use the configured application database for a destructive rehearsal." >&2
  exit 1
fi

mkdir -p "${ARTIFACT_DIR}"
COMPOSE=(docker compose -f "${PROJECT_ROOT}/infra/docker-compose.yml" --env-file "${ENV_FILE}")

db_url() {
  local database_name="$1"
  printf 'postgresql+asyncpg://%s:%s@127.0.0.1:%s/%s' \
    "${POSTGRES_USER}" "${POSTGRES_PASSWORD}" "${POSTGRES_PORT:-5432}" "${database_name}"
}

alembic_for() {
  local database_name="$1"
  shift
  (
    cd "${PROJECT_ROOT}/backend"
    DATABASE_URL="$(db_url "${database_name}")" ../.venv/bin/alembic "$@"
  )
}

psql_for() {
  local database_name="$1"
  shift
  "${COMPOSE[@]}" exec -T postgres psql -v ON_ERROR_STOP=1 \
    -U "${POSTGRES_USER}" -d "${database_name}" "$@"
}

drop_rehearsal_databases() {
  "${COMPOSE[@]}" exec -T postgres dropdb -U "${POSTGRES_USER}" --if-exists "${RUN_DB}" >/dev/null
  "${COMPOSE[@]}" exec -T postgres dropdb -U "${POSTGRES_USER}" --if-exists "${RESTORE_DB}" >/dev/null
}

cleanup() {
  if [[ "${KEEP_DATABASES}" != "1" ]]; then
    drop_rehearsal_databases
  fi
}
trap cleanup EXIT

"${COMPOSE[@]}" up -d --wait postgres
drop_rehearsal_databases
"${COMPOSE[@]}" exec -T postgres createdb -U "${POSTGRES_USER}" "${RUN_DB}"

if [[ -n "${SOURCE_DUMP}" ]]; then
  if [[ ! -f "${SOURCE_DUMP}" ]]; then
    echo "SOURCE_DUMP does not exist: ${SOURCE_DUMP}" >&2
    exit 1
  fi
  "${COMPOSE[@]}" exec -T postgres pg_restore \
    -U "${POSTGRES_USER}" -d "${RUN_DB}" --exit-on-error --no-owner --no-privileges \
    < "${SOURCE_DUMP}"
  SOURCE_KIND="production/main clone: ${SOURCE_DUMP}"
else
  alembic_for "${RUN_DB}" upgrade 0002
  # origin/main's committed 0002 created varchar(30). Staging later corrected
  # that historical file to varchar(50), so force the disposable source to the
  # actual main schema before testing the forward 0003a widening migration.
  psql_for "${RUN_DB}" -c "ALTER TABLE facilities ALTER COLUMN facility_type TYPE varchar(30)"
  psql_for "${RUN_DB}" -c \
    "INSERT INTO facilities (id, code, name, state_code, facility_type) VALUES
     ('00000000-0000-4000-8000-000000000001', 'REHEARSAL', 'Migration Rehearsal', 'RJ', 'district_hospital')"
  psql_for "${RUN_DB}" -c \
    "INSERT INTO users
       (id, keycloak_sub, username, full_name, facility_id, employee_id)
     VALUES
       ('00000000-0000-4000-8000-000000000002', 'rehearsal-sub', 'rehearsal-user',
        'Rehearsal User', '00000000-0000-4000-8000-000000000001', 'REHEARSAL-1')"
  SOURCE_KIND="synthetic origin/main schema at revision 0002"
fi

alembic_for "${RUN_DB}" current | grep -q '^0002'
psql_for "${RUN_DB}" -Atc \
  "SELECT data_type || ':' || character_maximum_length
   FROM information_schema.columns
   WHERE table_name='facilities' AND column_name='facility_type'" \
  | grep -q '^character varying:30$'

PRE_DUMP="${ARTIFACT_DIR}/main-0002-before-upgrade.dump"
"${COMPOSE[@]}" exec -T postgres pg_dump \
  -U "${POSTGRES_USER}" -d "${RUN_DB}" --format=custom --no-owner --no-privileges \
  > "${PRE_DUMP}"

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
alembic_for "${RUN_DB}" upgrade 0046
FINISHED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
alembic_for "${RUN_DB}" current | grep -q '^0046'

psql_for "${RUN_DB}" -Atc "SELECT count(*) FROM facilities WHERE code='REHEARSAL'" | grep -q '^1$'
psql_for "${RUN_DB}" -Atc "SELECT count(*) FROM users WHERE username='rehearsal-user'" | grep -q '^1$'

POST_DUMP="${ARTIFACT_DIR}/staging-0046-after-upgrade.dump"
"${COMPOSE[@]}" exec -T postgres pg_dump \
  -U "${POSTGRES_USER}" -d "${RUN_DB}" --format=custom --no-owner --no-privileges \
  > "${POST_DUMP}"

"${COMPOSE[@]}" exec -T postgres createdb -U "${POSTGRES_USER}" "${RESTORE_DB}"
"${COMPOSE[@]}" exec -T postgres pg_restore \
  -U "${POSTGRES_USER}" -d "${RESTORE_DB}" --exit-on-error --no-owner --no-privileges \
  < "${POST_DUMP}"

alembic_for "${RESTORE_DB}" current | grep -q '^0046'
psql_for "${RESTORE_DB}" -Atc "SELECT count(*) FROM facilities WHERE code='REHEARSAL'" | grep -q '^1$'
psql_for "${RESTORE_DB}" -Atc "SELECT count(*) FROM users WHERE username='rehearsal-user'" | grep -q '^1$'

PRE_SHA="$(shasum -a 256 "${PRE_DUMP}" | awk '{print $1}')"
POST_SHA="$(shasum -a 256 "${POST_DUMP}" | awk '{print $1}')"
cat > "${ARTIFACT_DIR}/report.txt" <<REPORT
HealthDoc migration rehearsal: PASS
Source: ${SOURCE_KIND}
Upgrade: 0002 -> 0046
Started (UTC): ${STARTED_AT}
Finished (UTC): ${FINISHED_AT}
Pre-upgrade backup: ${PRE_DUMP}
Pre-upgrade SHA-256: ${PRE_SHA}
Post-upgrade backup: ${POST_DUMP}
Post-upgrade SHA-256: ${POST_SHA}
Restore validation: PASS at revision 0046
Seed row preservation: PASS (facility and user)
REPORT

cat "${ARTIFACT_DIR}/report.txt"
echo "Artifacts: ${ARTIFACT_DIR}"
