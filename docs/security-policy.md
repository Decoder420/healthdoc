# HealthDoc security policy (BA-W8-01)

Scope: the HealthDoc HMIS platform (edge + cloud). Framework: DPDP Act 2023, ABDM data
policies, CERT-In directions. (Not HIPAA — US law, out of scope.)

## Access control
- Authentication: Keycloak (OIDC + PKCE); 15-min access tokens; brute-force lockout
  (5 failures → 15-minute wait); MFA (TOTP) required for `admin` and `supervisor`.
- Authorization: RBAC (`require_roles`) + ABAC policy layer (`common/abac.py`, `policies`
  table). Superadmin is cloud-only and cannot read clinical data.
- Break-glass: MFA-gated, justification-required, 2-hour window, dual-notified, and every
  use written to `data_access_log` with `emergency_access=true` for mandatory review.

## Data protection
- Aadhaar & ABHA linking tokens: AES-256-GCM + HMAC blind index, two keys, key-versioned
  rotation. Plaintext exists nowhere (DB, logs, API, exports).
- Files: private MinIO, presigned URLs, per-access logging.
- Financial: immutable once issued, gapless numbering, reversal-only corrections.

## Accountability & monitoring
- Append-only, hash-chained, Ed25519-signed `audit_logs`; periodic integrity re-check.
- Every clinical read logged to `data_access_log` (incl. denials).
- Weekly automated OWASP ZAP baseline scan; exit criterion zero Critical/High.

## Network
- Single TLS 1.3 ingress (Nginx); HSTS, CSP, X-Frame-Options, nosniff.
- CORS locked to the Electron/desktop origins; no wildcard.
- Datastores never exposed publicly.

## Incident response (DPDP breach)
- CERT-In: report within 6 hours of detection.
- Data Protection Board: intimate without delay; detailed report within 72 hours.
- Affected patients: notify without delay. Tracked in `data_breach_notifications`.

## Review
This policy is reviewed each release; owner: B1 / Tech Lead.
