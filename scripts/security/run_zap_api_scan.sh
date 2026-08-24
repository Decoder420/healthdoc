#!/usr/bin/env bash
# Authenticated active scan of the disposable local API for issue #242.
# The target is fixed to the compose backend: this script cannot scan staging or
# production accidentally. Active scanning sends attack payloads and may create
# rows, so a verified PostgreSQL backup is taken before ZAP starts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE=(docker compose -f "$REPO_ROOT/infra/docker-compose.yml" --env-file "$REPO_ROOT/.env")
ZAP_IMAGE="${ZAP_IMAGE:-ghcr.io/zaproxy/zaproxy:2.17.0}"
ZAP_ROLE="${ZAP_ROLE:-admin}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ARTIFACT_DIR="${ZAP_ARTIFACT_DIR:-$REPO_ROOT/backups/zap/$STAMP}"
AUTH_HEADER_FILE="$(mktemp /tmp/healthdoc-zap-auth.XXXXXX)"

cleanup() {
  rm -f "$AUTH_HEADER_FILE"
  unset ZAP_AUTH_HEADER ZAP_AUTH_HEADER_VALUE ZAP_AUTH_HEADER_SITE
}
trap cleanup EXIT
chmod 600 "$AUTH_HEADER_FILE"
mkdir -p "$ARTIFACT_DIR/pre-scan-backup"

NGINX_CONTAINER="$("${COMPOSE[@]}" ps -q nginx)"
BACKEND_CONTAINER="$("${COMPOSE[@]}" ps -q backend)"
if [ -z "$NGINX_CONTAINER" ] || [ -z "$BACKEND_CONTAINER" ]; then
  echo "ERROR: local HealthDoc stack is not running; run 'make up' first." >&2
  exit 1
fi

NETWORK="$(docker inspect -f '{{range $name, $_ := .NetworkSettings.Networks}}{{$name}}{{"\n"}}{{end}}' "$BACKEND_CONTAINER" | head -n 1)"
if [ -z "$NETWORK" ]; then
  echo "ERROR: could not determine the compose network." >&2
  exit 1
fi

echo "Taking a verified pre-scan PostgreSQL backup ..."
"$REPO_ROOT/backend/scripts/backup/backup_postgres.sh" "$ARTIFACT_DIR/pre-scan-backup"

echo "Obtaining an ephemeral bearer header through the real Keycloak PKCE login ..."
(
  cd "$REPO_ROOT/frontend"
  E2E_ROLE="$ZAP_ROLE" \
  E2E_TOKEN_HEADER_FILE="$AUTH_HEADER_FILE" \
  E2E_ARTIFACT_DIR="$ARTIFACT_DIR/e2e" \
  npm run test:e2e
)
if [ ! -s "$AUTH_HEADER_FILE" ]; then
  echo "ERROR: browser authentication produced no bearer header." >&2
  exit 1
fi

# curl reads the sensitive header from a 0600 file, so the token never appears
# in process arguments or logs. This proves the scan identity maps to a real
# users row before a long active scan is allowed to begin.
HTTP_STATUS="$(curl -sk --max-time 20 -o /dev/null -w '%{http_code}' \
  -H "@$AUTH_HEADER_FILE" https://localhost/api/v1/users/me)"
if [ "$HTTP_STATUS" != "200" ]; then
  echo "ERROR: authenticated preflight returned HTTP $HTTP_STATUS, expected 200." >&2
  exit 1
fi

export ZAP_AUTH_HEADER="Authorization"
export ZAP_AUTH_HEADER_VALUE="$(sed -n 's/^Authorization: //p' "$AUTH_HEADER_FILE")"
export ZAP_AUTH_HEADER_SITE="backend"
if [ -z "$ZAP_AUTH_HEADER_VALUE" ]; then
  echo "ERROR: bearer value could not be read from the protected header file." >&2
  exit 1
fi

echo "Running authenticated OWASP ZAP API active scan on the local compose backend ..."
docker run --rm \
  --network "$NETWORK" \
  -e ZAP_AUTH_HEADER \
  -e ZAP_AUTH_HEADER_VALUE \
  -e ZAP_AUTH_HEADER_SITE \
  -v "$ARTIFACT_DIR:/zap/wrk:rw" \
  "$ZAP_IMAGE" \
  zap-api-scan.py \
  -t http://backend:8000/api/v1/openapi.json \
  -f openapi \
  -I \
  -T 10 \
  -J zap-report.json \
  -r zap-report.html \
  -w zap-report.md

"$REPO_ROOT/.venv/bin/python" "$SCRIPT_DIR/check_zap_report.py" \
  "$ARTIFACT_DIR/zap-report.json" | tee "$ARTIFACT_DIR/high-critical-summary.txt"

echo "ZAP artifacts: $ARTIFACT_DIR"
