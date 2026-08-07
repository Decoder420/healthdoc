# ISMS asset inventory (BA-W8-01)

| # | Asset | Type | Classification | Owner | Controls |
|---|-------|------|----------------|-------|----------|
| 1 | PostgreSQL (system of record) | Data store | Restricted (PHI+PII) | B1 | TLS, RBAC/ABAC, audit, encrypted volume, backups |
| 2 | MongoDB (clinical notes, FHIR, ABDM payloads) | Data store | Restricted | B1 | internal-only, TLS, backups |
| 3 | Redis (queue state, cache, pub/sub) | Cache/broker | Internal | B1 | internal-only; no durable PHI |
| 4 | MinIO (files, reports, audit archives) | Object store | Restricted | B7 | private buckets, presigned URLs, access log |
| 5 | Orthanc PACS (DICOM) | Imaging store | Restricted | B5 | auth, internal-only |
| 6 | Keycloak (identity) | IAM | Restricted (credentials) | B1 | MFA, brute-force lockout, no app-side passwords |
| 7 | FastAPI backend | Application | Confidential | B1 | JWT verify, envelope, audit middleware |
| 8 | Next.js/Electron frontend | Application | Internal | F1 | CORS lock, CSP, role-guarded routes |
| 9 | Nginx edge | Network | Confidential | B1 | TLS 1.3, security headers, rate limits |
| 10 | ABDM Gateway credentials | Secret | Restricted | B1 | env/secret manager, never in repo |
| 11 | Crypto keys (Aadhaar/ABHA AES+HMAC) | Secret | Restricted | B1/B2 | env/secret manager, versioned rotation |
| 12 | Audit log chain | Data/integrity | Restricted | B7 | append-only, hash-chained, signed, archived |
| 13 | Outbox / edge-cloud sync | Data pipeline | Restricted | B1 | mTLS, sensitivity-tiered conflict rules |
| 14 | CI/CD (GitHub Actions) | Pipeline | Confidential | B1 | branch protection, CODEOWNERS, ZAP scan |

Classification key: Restricted (health/PII/secrets) > Confidential (system integrity) >
Internal > Public. Review cadence: each release.
