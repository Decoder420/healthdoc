#!/bin/sh
# Creates HealthDoc buckets on first boot (idempotent).
set -e
mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
for b in "$MINIO_BUCKET_FILES" "$MINIO_BUCKET_REPORTS"; do
  mc mb --ignore-existing "local/$b"
  mc anonymous set none "local/$b"   # private: access only via backend presigned URLs
done
echo "MinIO buckets ready"
