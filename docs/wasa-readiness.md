# WASA readiness — HealthDoc HMIS

**Assessed:** 26 Aug 2026, against `staging` @ `beb5ba7`
**Standard:** NHA Web Application Security Assessment (CERT-In empanelled auditor)
**Pass condition:** zero open Critical, High **or Medium** findings

> This is a self-assessment from source. It does not replace the auditor's VAPT —
> it is meant to remove the findings they would otherwise write up, before the
> clock starts.

---

## Verdict

**Not ready to book the audit.** Two blockers, both fixable in days, neither
architectural.

The security *architecture* is genuinely strong — TLS 1.3-only, full header set,
AES-GCM at rest with key versioning, tokens never leaving memory, facility
scoping backed by tests. What fails is inventory hygiene and one missing control.

| Track | State |
|---|---|
| Cybersecurity (VAPT) | 2 blockers, 3 minor |
| ABDM functional | **Cannot be assessed — the workflows do not exist yet** |

---

## Blockers

### B1 — `python-jose` is the JWT library and carries unfixable CVEs

`app/auth/deps.py:73` verifies every access token with `python-jose` 3.3.0.

| CVE | Impact |
|---|---|
| PYSEC-2024-232 (CVE-2024-33663) | Algorithm confusion |
| PYSEC-2024-233 (CVE-2024-33664) | DoS via crafted JWE |
| PYSEC-2025-185 | **No fix version published** |

An auditor will find a vulnerable dependency on the *authentication path* —
which is the highest-value line in the application. PYSEC-2025-185 has no
upstream fix, so version-bumping cannot close it. The library is effectively
unmaintained.

**Remediation:** migrate to `PyJWT`. Localised — the only call sites are
`jwt.decode` and the `JWTError` import in `app/auth/deps.py`. This also removes
the transitive `ecdsa` finding (PYSEC-2026-1325, likewise no fix), since `ecdsa`
arrives only through `python-jose[cryptography]`.

### B2 — No MFA

`infra/keycloak/realm-healthdoc.json` has no `otpPolicyType`, no OTP required
action, and an empty `authenticationFlows`. WASA requires *"robust MFA
enforcement for clinical/admin users."*

This is the one finding that is a missing **control**, not a missing patch — it
cannot be closed by an upgrade, and it needs a rollout decision.

**Remediation:** enable OTP in the realm and make `CONFIGURE_TOTP` a required
action for `admin`, `doctor` and `auditor` at minimum. Decide whether it is
enforced for all clinical roles or risk-scoped, and document the reasoning —
auditors ask.

---

## Fixed during this assessment (`beb5ba7`)

**Unvalidated identifier interpolated into DDL.** `app/users/models.py` built a
sequence name from `facilities.code` with only `.replace("-", "_")` applied — a
normalisation, not a sanitiser. `CREATE SEQUENCE` cannot bind its name as a
parameter, so the allowlist is the only defence. Both sibling sites
(`patients/service.py`, `emergency/service.py`) already validated against
`^[A-Za-z0-9_]{1,20}$`; this one did not, and it is wired to an `after_insert`
hook that runs on every facility insert. Not reachable today only because no
facilities endpoint exists.

**`/docs` and `/openapi.json` served unconditionally.** The schema is a complete
API inventory and is reported as information disclosure. Now gated on
`environment`. The gate's default was itself wrong — `environment` defaults to
`"dev"` and `.env.production.example` did not set it, so it would have failed
open in production. `ENVIRONMENT=production` added there.

---

## Minor — close before the audit, cheap

| # | Finding | Where |
|---|---|---|
| M1 | `starlette` 0.46.2 — 9 CVEs (fix ≤1.3.1); requires a FastAPI bump | `requirements.txt:1` |
| M2 | `python-multipart` 0.0.9 — 7 CVEs (fix 0.0.31); this is the **file-upload** parser | `requirements.txt:15` |
| M3 | CSP allows `script-src 'unsafe-inline'` — a standard scanner finding; needs Next.js nonces to remove | `infra/nginx/prod-conf.d/healthdoc.conf:26` |
| M4 | Five unauthenticated `/ping` endpoints returning `{"status":"stub"}` | `ot`, `blood_bank`, `registration`, `security_audit`, `outbox` routers |
| M5 | Session-presence cookie lacks `Secure` (holds only `"1"` + a role hint — no token) | `frontend/src/lib/auth/index.ts:35` |
| M6 | No Keycloak `passwordPolicy` — no complexity or history rules | `realm-healthdoc.json` |
| M7 | `Facility.timezone` declared three times with disagreeing defaults; last wins | `app/users/models.py:27,31,33` |

---

## Passing — evidence for the Audit Scope Document

| Requirement | Evidence |
|---|---|
| SQL injection | All raw SQL uses bound parameters. Seven f-string `text()` sites reviewed: five are dialect-gated literals or fixed `WHERE` fragments with bound values; three interpolate a sequence name and **all three now validate against an allowlist**. |
| XSS | Zero `dangerouslySetInnerHTML` / `innerHTML` in the frontend. |
| BOLA / IDOR | Facility scoping in 25 routers; 15 test files assert cross-facility isolation. Cross-facility ids return **404, not 403** — a 403 confirms existence and is an enumeration oracle. The five routers without scoping are unimplemented stubs; `ipd` is a re-export of the properly scoped `admissions`. |
| SSRF | Every outbound URL derives from settings (`jwt_issuer`, `icd11_base_url`, `abdm_gateway_base_url`). No request data reaches a URL. |
| Brute force | Keycloak: `bruteForceProtected`, `failureFactor: 5`, 15-minute lockout, non-permanent. Covered by `tests/test_auth_lockout_policy.py`. |
| Rate limiting | nginx `limit_req` — 30 r/s API, 10 r/s auth, both burst-limited. |
| Token handling | Access token in memory only — never cookie, never `localStorage` (`lib/auth/keycloak.ts:8`). Logout calls Keycloak `end_session`. |
| TLS | `ssl_protocols TLSv1.3` only. |
| Headers | HSTS (2 yr, `includeSubDomains`), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, CSP with `frame-ancestors 'none'`. |
| Data at rest | AES-GCM via `cryptography`; key **versioning** with multi-version read and rotation support; Aadhaar stored as HMAC blind index, never plaintext. |
| Error leakage | No handler returns exception text. No `detail=str(exc)` anywhere. |
| Frontend deps | `npm audit --omit=dev` → **0 vulnerabilities**. |
| Audit trail | Append-only `audit_logs` with per-facility hash chaining, enforced by DB triggers (update/delete raise). |

---

## The ABDM functional track

This is the part that cannot be bought with a sprint of fixes.

| ABDM module | Implemented |
|---|---|
| `identity` | 457 lines — link / read / unlink an ABHA number the patient already holds |
| `fhir` | 341 lines — bundle builders |
| `hip` | **empty** |
| `hiu` | **empty** |
| `consent` (ABDM) | **empty** |
| `nhcx` | **empty** |

WASA requires the auditor to *document evidence* of:

- **ABHA workflow verification** — creating and validating ABHA numbers.
  M1 creation flows (enrol by Aadhaar OTP, login by mobile OTP) are **not built**.
  `_VERIFY_PATH` is `None`, so even verification of an existing ABHA is inert
  pending the v3 path. The Redis OTP transaction store exists and its
  `OtpPurpose` enum already anticipates the three flows — the scaffolding is
  there, the gateway calls are not.
- **Consent Manager integrity** — the ABDM consent module is empty. The internal
  DPDP consent engine is solid and enforced (`consent_required` gating in
  `patients/router.py`), but it is not the ABDM consent artifact the auditor
  tests.
- **HIP/HIU key handling** — no HIP or HIU implementation exists to hold keys.

**There is nothing here for an auditor to test.** Booking WASA now means paying
for an assessment of an integration that is one-sixth built.

---

## Recommended order

1. **Replace `python-jose` with PyJWT** — Critical, on the auth path, one CVE unfixable. Half a day.
2. **Bump `starlette` (via FastAPI) and `python-multipart`** — mechanical; re-run `pip-audit` to zero.
3. **Enable MFA in the realm** — needs your rollout decision, so start it early.
4. **Close M3–M7** — an afternoon.
5. **Build ABDM M1 properly** — enrol-by-Aadhaar and login-by-ABHA, against the v3 spec. The session path is now confirmed (`/api/hiecm/gateway/v3/sessions`); the enrolment paths are the remaining unknown.
6. **Then** scope the audit — with M1 working end-to-end in sandbox, which is what the functional track actually examines.

Re-run before booking:

```bash
cd backend && pip-audit -r requirements.txt     # must be empty
cd frontend && npm audit --omit=dev             # currently clean
make test-pg                                    # 889 passing
```

---

## Two answers the auditor will ask for

**Role:** HIP **and** HIU. `.env.example` records the sandbox as registered for
both. Note this widens the functional scope — an HIU is assessed on consent
handling and data *requests*, an HIP on data *provision*; both are unbuilt.

**Remediation capacity:** every finding above is either a dependency bump, a
Keycloak realm setting, or a localised code change. None requires architectural
rework. The one needing a decision rather than a patch is MFA scope.
