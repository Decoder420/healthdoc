#!/usr/bin/env bash
# Self-signed cert for local dev only. Never use in staging/prod.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)/certs"
mkdir -p "$DIR"
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout "$DIR/dev.key" -out "$DIR/dev.crt" \
  -subj "/CN=localhost/O=HealthDoc Dev" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
echo "Wrote $DIR/dev.crt and dev.key"
