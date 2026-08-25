# HealthDoc Completion Handoff

**Measured:** 24 August 2026, Asia/Kolkata

**Target:** reviewed release candidate on `staging` by 27 August 2026

**Working branch:** `release-readiness`

**Production branch:** `main`

This is the current source of truth for finishing HealthDoc. Older counts in
`docs/release-readiness.md` describe earlier snapshots and must not override the
measurements below.

## Release policy — mandatory

Product work must never target `main` directly.

1. Develop and review on `release-readiness` or another focused branch.
2. Merge product work into `staging` through a reviewed PR with green CI.
3. Rehearse the production-data migration, restore and rollback from the exact
   staging release SHA.
4. Only then open one separately reviewed `staging` → `main` promotion PR.

PR #413 targeted `main` directly and contained 881 files because it carried old
branch history. Its useful patient-search normalization and pagination work was
already ported in commit `ea76cac` and promoted through PRs #415/#416. PR #413
was therefore documented and closed; it must not be reopened or merged.

## Verified baseline

| Gate | Measured result |
|---|---|
| Backend suite against PostgreSQL | **733 passed** in 33.38s |
| Migration integrity | **55 migrations**, linear, downgrades present, head `0048` |
| Schema/spec check | **96 tables**, 67 enums, map/FKs/ModuleCode consistent |
| Schema drift | **0 blockers**, 57 documentation warnings |
| Frontend/backend contract | **131/131 calls match OpenAPI** |
| Frontend fixture importers | **0** (was 27); unused fixture libraries deleted |
| Files using the API client | **59** |
| Routed pages | **34** |
| Frontend TypeScript | Passed |
| Frontend ESLint | **0 errors, 0 warnings** |
| Frontend convention check | **169 files, 0 blockers, 0 warnings** |
| Next.js production build | Passed |
| Real Keycloak browser gates | **8 passed**: receptionist, doctor, nurse, lab, radiology, pharmacist, billing, admin |

Reproduce the gates:

```bash
make test-pg
cd frontend
npm run typecheck
npm run lint
npm run build
npm run test:e2e
cd ../backend
../.venv/bin/python -m scripts.check_frontend_contracts \
  --write ../docs/api-contract-matrix.md
../.venv/bin/python -m scripts.check_migration_integrity
../.venv/bin/python -m scripts.spec_check
../.venv/bin/python -m scripts.schema_drift_check
```

## Completed from the release checklist

### 1. Latest release work integrated into staging

Complete through the consent/break-glass tranche. PRs #415, #416, #417, #419,
#420 and #421 are merged, reviewed and green on `staging`. `release-readiness`
was fast-forwarded from the PR #421 staging merge before the current procedure
change began. New work must go through a new PR to `staging`; do not bypass
review.

### 2. Core product modules

- OPD/reception: registration, duplicate search, visit and queue workflows use
  real APIs and idempotency keys.
- IPD/nursing: admissions, beds, transfers, discharge, eMAR and ward worklists
  use live APIs.
- Lab: order worklist, result entry and verification are implemented. The old
  unreachable mock dashboard and its mock patient profile have been deleted.
- Pharmacy: prescription queue and dispense journey are implemented; inventory
  procurement read paths are present.
- Billing: all six fixture-backed reads were retired, including refund reads.
- Radiology: no longer a title shell; scheduling, scan completion, report draft
  and sign-off are wired.
- Doctor consultation: encounters, SOAP notes, vitals, ICD search, diagnoses,
  lab orders, radiology orders, minor/bedside/emergency procedure orders and
  prescriptions now use real APIs. Child
  clinical writes stay locked until the server creates the encounter; reloads
  restore that encounter by visit instead of minting a browser UUID.
- Inventory: GRN, indent and adjustment workspaces are implemented.
- Reports: backend is no longer a ping stub; the KPI/MIS read path is live.
- Consent: per-patient workflow is API-backed. There is no fixture-backed
  facility-wide console pretending to be complete.
- Consent enforcement: patient history now fails closed without active
  `clinical_review` consent or the caller's active break-glass grant. Emergency
  reads are marked `emergency_access=true` in the access ledger. Migration
  `0048` seeds that canonical consent purpose on every fresh/updated database.
- Break-glass: the final fixture flow is retired. Access checks, two-hour grant
  creation/read-back and revocation use the backend; fabricated inline TOTP has
  been removed. Keycloak owns re-authentication and the API accepts a grant only
  when the bearer token's `amr` proves OTP/MFA.
- Procedures: `/procedures` now has a facility-scoped, idempotent create and
  encounter read-back contract. Patient, encounter and performer attribution
  are server-owned; cross-facility IDs, wrong order types and duplicate detail
  rows are rejected. OT is not offered in the doctor form without a real OT
  schedule. Patient merge now repoints orders, prescriptions and procedure
  records together instead of splitting their clinical identity.

### 3. Integration and quality gates

- The frontend/backend contract parser is fixed and guarded by tests.
- All **131** statically discoverable frontend API calls match OpenAPI.
- Fixture importers fell from 27 to **0**; the now-unreferenced fixture files
  were deleted as well.
- Encounter PATCH now enforces `If-Match` and returns the current server copy
  on a stale write. Encounter, diagnosis, vitals and order creation paths honor
  stable idempotency keys.
- Order creation rejects a patient outside the encounter, and
  Lab/Radiology/Procedure detail writes reject the wrong order type.
- React compiler warnings fell from 4 to **0** by using `useWatch` instead of
  the non-memoizable `react-hook-form` `watch` function.
- The real browser gate now proves:
  - receptionist login → registration → bearer patient search;
  - doctor login → dashboard → bearer queue worklist;
  - nurse login → ward dashboard → bearer nursing tasks;
  - lab technician login → worklist → bearer pathology order-items request;
  - radiology technician login → worklist → bearer radiology order-items request;
  - pharmacist login → prescription queue → bearer pharmacy request;
  - receptionist billing navigation → bearer invoice request;
  - admin login → users workspace → bearer users request;
  - every journey also verifies `silent-check-sso.html` returns 200.

## What remains, honestly ranked

### P0 — cannot promote staging to main without these

#### P0.1 Real production database rehearsal

The synthetic migration/backup/restore harness exists. It does not replace a
rehearsal with a sanitized dump from the production/main database.

```bash
SOURCE_DUMP=/absolute/path/to/sanitized-main.dump make migration-rehearsal
```

Record the source checksum, pre/post row counts, migration duration, backup
checksum, restore duration, restored Alembic revision and rollback decision.
The wider recovery plan must also cover MongoDB, MinIO, Keycloak realm/config
and secrets; logical PostgreSQL backup alone is not complete PITR.

**External input required:** sanitized production dump and operations owner.

#### P0.2 Verified patient identity and Patient Portal

`/patient-portal` correctly fails closed because there is no trustworthy
authenticated-user → patient/guardian binding. Do not derive a patient from
email, mobile, username, token display name or a browser-supplied patient id.

Required work after policy approval:

1. Approve patient self-link and guardian/dependent verification rules.
2. Add an auditable forward migration for the binding and its lifecycle.
3. Add `/patients/me`-style endpoints resolved only from the verified token.
4. Add revocation, duplicate-binding and guardian-expiry handling.
5. Add a real patient Keycloak/browser journey.

**External input required:** clinical/privacy owner approval of the identity and
guardian policy.

#### P0.3 Clinical alert thresholds

Lab critical alerts still include a placeholder haemoglobin rule. Units,
population ranges, age/sex handling, escalation recipients and acknowledgement
SLA require clinical-owner sign-off. Do not invent clinical thresholds.

#### P0.4 Patient-merge financial/allergy consistency

Orders, prescriptions and procedure records now move together during an
approved patient merge. Two older cross-module references remain explicitly
unhandled: `allergies.patient_id` and `invoices.patient_id`. Invoice identity
cannot simply be bulk-updated after issue because the database freeze trigger
correctly protects issued financial records. Approve a clinically and
financially auditable merge rule, implement it, and add PostgreSQL coverage;
do not silently move one side or add another allowlist exception.

#### P0.5 Security and recovery sign-off

- GitHub issue #368 remains open: `file_access_log.file_id` deletion restriction
  conflicts with DPDP erasure.
- Run authenticated OWASP ZAP and close or formally accept every high/critical
  result.
- Run cross-facility authorization regression from each release role.
- Perform authenticated clinical-journey load tests, not only public health or
  shell-page load.
- Prove backup, restore, rollback and recovery of every stateful service.
- Enroll a real doctor/emergency account in Keycloak OTP and run one browser
  gate that proves re-authentication produces `amr=otp`, grant creation returns
  a server-owned grant ID, the clinical read succeeds, and revocation closes it.
  The realm now includes the AMR token mapper and the application fails closed,
  but the repository deliberately does not contain a clinician's OTP secret.

### P1 — product completion

#### P1.1 One remaining named browser gate

All named staff/business journeys now pass. The only named journey still
missing is patient, blocked by P0.2.

The earlier checklist said “nine additional” but named only eight roles. Count
the named journeys, not the typo. Every completed staff gate now has a matching
Keycloak account and users row and proves the route, role guard, bearer header
and successful business API response.

#### P1.2 Incomplete operational modules

- ABDM delivery monitoring remains unavailable and needs sandbox credentials,
  delivery-status contracts and external UAT.
- A facility-wide consent operations console is not built. Decide whether it
  is release scope; the per-patient workflow is complete.
- Prometheus/Grafana dashboards, alert routing and production runbooks need an
  operations owner and production targets.

### P2 — quality closure

- Document the remaining 57 schema fields reported by
  `scripts.schema_drift_check`; there are no blockers, but the schema document
  is incomplete.
- Complete accessibility, keyboard-only and screen-reader review.
- Verify every print/PDF path against supported browsers and real data.
- Review indexes using production-shaped query plans.
- Complete responsive and performance testing for real journeys.

## Immediate execution order

1. Obtain the sanitized dump, patient/guardian policy and clinical thresholds
   immediately; these are schedule-critical external inputs.
2. Enroll a test clinician in Keycloak OTP and run the real break-glass browser
   gate; the application and API flow are implemented and fail closed.
3. Approve and implement the remaining allergy/invoice patient-merge rule.
4. Resolve issue #368, then run ZAP and authenticated load tests.
5. Run the real-data migration/restore/rollback rehearsal from the exact staging
   release SHA.
6. Merge only reviewed, green PRs to `staging`; soak and sign off.
7. Open a separate `staging` → `main` PR. Never merge a feature branch directly
   into `main`.

## 27 August reality check

A reviewed staging release candidate is still possible by 27 August only if
the sanitized database dump, identity/guardian policy and clinical threshold
decision arrive immediately and scope is frozen. The procedure contract, staff
E2Es and doctor consultation wiring are complete. Code cannot manufacture
external approvals, a clinician's real OTP enrollment, or proof of a
production-data restore without the required access.

If any P0 input is missing, keep `main` unchanged and report the release as
blocked by that named gate. Passing static tests is not permission to bypass a
clinical, privacy, recovery or branch-policy control.
