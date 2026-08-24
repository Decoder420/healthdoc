#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TOKEN_DIR="${1:-/tmp/healthdoc-load-tokens}"

mkdir -p "$TOKEN_DIR"
chmod 700 "$TOKEN_DIR"

for role in doctor nurse lab-technician pharmacist billing-receptionist; do
    echo "Capturing short-lived Keycloak token for $role ..."
    (
        cd "$REPO_ROOT/frontend"
        E2E_ROLE="$role" \
        E2E_TOKEN_BUNDLE_FILE="$TOKEN_DIR/$role.json" \
        npm run test:e2e
    )
done

echo "Short-lived token bundles written with owner-only permissions to $TOKEN_DIR"
echo "Run: python3 $SCRIPT_DIR/load_test.py --config $SCRIPT_DIR/scenarios.json --token-dir $TOKEN_DIR --users 50 --duration 120 --think-time 2"
