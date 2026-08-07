# HealthDoc data-flow diagram (BA-W8-01)

Rendered diagram: `../healthdoc/docs/architecture.html` (§1 context, §3 request lifecycle,
§6 workflows). This file is the text description for the security/ISMS annex.

## Trust boundaries
1. **Public internet ↔ Nginx edge** — TLS 1.3 terminates here; only 443 exposed.
2. **Nginx ↔ app tier** — FastAPI + Next.js + Keycloak on the internal Docker network.
3. **App ↔ data tier** — Postgres/Mongo/Redis/MinIO/Orthanc, bound to 127.0.0.1, no public port.
4. **Facility edge ↔ Cloud** — outbox sync over mTLS; asynchronous, conflict-tiered.
5. **App ↔ ABDM Gateway** — outbound HTTPS to dev.abdm.gov.in (V3 only).

## Sensitive data paths
- Aadhaar/ABHA linking token: app-layer AES-256-GCM → `patient_identifiers` / `patients`
  (encrypted bytea, key-versioned). Never crosses a boundary in plaintext.
- Clinical reads: role + consent gate → `data_access_log` (every read, incl. break-glass).
- Every mutation: business write + `audit_logs` (hash-chained, signed) in one transaction,
  + `outbox_events` for cloud sync, same transaction.

## Data at rest / in transit
- At rest: Postgres volume + MinIO buckets encrypted; audit partitions archived w/ hashes.
- In transit: TLS 1.3 edge; mTLS edge↔cloud; HTTPS to ABDM.
