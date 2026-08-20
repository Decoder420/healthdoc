#!/usr/bin/env bash
# NTP + TLS verify — issue #244 (BB-W7-02).
#
# Schema context (v3.9 "Sync clock authority"): updated_at drives
# last-writer-wins sync between facility edge and cloud. A drifting edge
# clock silently overwrites newer cloud data. NTP (B1-W1-06) reduces
# skew but conflict resolution for important/critical tiers ultimately
# relies on (facility_id, chain/outbox sequence), not wall-clock alone —
# so this check exists to catch skew EARLY (alerting), not to be the
# safety mechanism itself. TLS is not schema-defined; this checks cert
# validity/expiry on the endpoints this facility depends on (API, and
# Keycloak per §"single-server edge" — Keycloak dying = nobody logs in).
#
# Usage:
#   ./scripts/verify/ntp_tls_verify.sh [config_file]
#
# config_file defaults to scripts/verify/tls_endpoints.conf — one
# "host:port" per line, '#' comments allowed. Edit that file to point
# at your actual staging hosts (API, Keycloak, etc).
#
# Exit code: 0 if all checks pass, 1 if any check fails (fit for use in
# CI / cron with alerting on non-zero exit).
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${1:-$SCRIPT_DIR/tls_endpoints.conf}"

MAX_CLOCK_SKEW_MS="${MAX_CLOCK_SKEW_MS:-1000}"   # alert threshold, schema doesn't pin a number
CERT_EXPIRY_WARN_DAYS="${CERT_EXPIRY_WARN_DAYS:-14}"

FAILED=0
pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1" >&2; FAILED=1; }
warn() { echo "  WARN: $1"; }

echo "=== NTP sync check ==="
if command -v chronyc >/dev/null 2>&1; then
    TRACKING="$(chronyc tracking 2>/dev/null || true)"
    if [ -z "$TRACKING" ]; then
        fail "chronyc installed but 'chronyc tracking' returned nothing — is chronyd running?"
    else
        LEAP_STATUS="$(echo "$TRACKING" | awk -F': ' '/Leap status/ {print $2}')"
        OFFSET_S="$(echo "$TRACKING" | awk -F': ' '/System time/ {print $2}' | awk '{print $1}')"
        if [ "$LEAP_STATUS" != "Normal" ]; then
            fail "chrony leap status is '$LEAP_STATUS' (expected 'Normal') — clock not trustworthy"
        else
            OFFSET_MS="$(awk -v s="$OFFSET_S" 'BEGIN{printf "%d", (s<0?-s:s)*1000}')"
            if [ "$OFFSET_MS" -gt "$MAX_CLOCK_SKEW_MS" ]; then
                fail "clock offset ${OFFSET_MS}ms exceeds ${MAX_CLOCK_SKEW_MS}ms threshold"
            else
                pass "chrony synced, leap status Normal, offset ${OFFSET_MS}ms"
            fi
        fi
    fi
elif command -v timedatectl >/dev/null 2>&1; then
    STATUS="$(timedatectl show -p NTPSynchronized -p SystemClockSynchronized 2>/dev/null || true)"
    if echo "$STATUS" | grep -qi "yes"; then
        pass "timedatectl reports clock synchronized"
    else
        fail "timedatectl reports clock NOT synchronized: $STATUS"
    fi
else
    warn "neither chronyc nor timedatectl found — cannot verify NTP sync on this host. Install chrony."
fi

echo ""
echo "=== TLS certificate check ==="
if [ ! -f "$CONFIG_FILE" ]; then
    warn "no config at $CONFIG_FILE — skipping TLS checks. Create it with 'host:port' lines."
else
    while IFS= read -r line; do
        line="$(echo "$line" | sed 's/#.*//' | xargs || true)"
        [ -z "$line" ] && continue
        HOST="${line%%:*}"
        PORT="${line##*:}"
        [ "$PORT" = "$HOST" ] && PORT=443

        EXPIRY_RAW="$(echo | timeout 10 openssl s_client -servername "$HOST" -connect "$HOST:$PORT" 2>/dev/null \
            | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || true)"

        if [ -z "$EXPIRY_RAW" ]; then
            fail "$HOST:$PORT — could not retrieve certificate (connection failed or no TLS)"
            continue
        fi

        EXPIRY_EPOCH="$(date -d "$EXPIRY_RAW" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRY_RAW" +%s 2>/dev/null || echo 0)"
        NOW_EPOCH="$(date +%s)"
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

        if [ "$EXPIRY_EPOCH" -eq 0 ]; then
            fail "$HOST:$PORT — got a cert but couldn't parse expiry date '$EXPIRY_RAW'"
        elif [ "$DAYS_LEFT" -lt 0 ]; then
            fail "$HOST:$PORT — certificate EXPIRED ($EXPIRY_RAW)"
        elif [ "$DAYS_LEFT" -lt "$CERT_EXPIRY_WARN_DAYS" ]; then
            warn "$HOST:$PORT — certificate expires in ${DAYS_LEFT}d ($EXPIRY_RAW), under ${CERT_EXPIRY_WARN_DAYS}d threshold"
        else
            pass "$HOST:$PORT — certificate valid, ${DAYS_LEFT}d remaining"
        fi
    done < "$CONFIG_FILE"
fi

echo ""
if [ "$FAILED" -eq 0 ]; then
    echo "All checks passed (warnings, if any, are non-fatal)."
    exit 0
else
    echo "One or more checks FAILED." >&2
    exit 1
fi