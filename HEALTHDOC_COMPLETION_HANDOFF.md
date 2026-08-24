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
| Backend suite against PostgreSQL | **714 passed** in 32.37s |
| Migration integrity | **54 migrations**, linear, downgrades present, head `0047` |
| Schema/spec check | **96 tables**, 67 enums, map/FKs/ModuleCode consistent |
| Schema drift | **0 blockers**, 57 documentation warnings |
| Frontend/backend contract | **115/115 calls match OpenAPI** |
| Frontend fixture importers | **3**, all in the doctor module (was 27) |
| Files using the API client | **53** |
| Routed pages | **34** |
| Frontend TypeScript | Passed |
| Frontend ESLint | **0 errors, 0 warnings** |
| Frontend convention check | **193 files, 0 blockers, 0 warnings** |
| Next.js production build | Passed |
| Real Keycloak browser gates | **4 passed**: receptionist, doctor, nurse, admin |

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

Complete. PR #415 and PR #416 are merged, reviewed and green. Before the work
described in this handoff, `origin/staging` and `origin/release-readiness` had
different histories but the exact same Git tree. New work must go through a new
PR to `staging`; do not bypass review.

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
- Inventory: GRN, indent and adjustment workspaces are implemented.
- Reports: backend is no longer a ping stub; the KPI/MIS read path is live.
- Consent: per-patient workflow is API-backed. There is no fixture-backed
  facility-wide console pretending to be complete.

### 3. Integration and quality gates

- The frontend/backend contract parser is fixed and guarded by tests.
- All **115** statically discoverable frontend API calls match OpenAPI.
- Fixture importers fell from 27 to **3**.
- React compiler warnings fell from 4 to **0** by using `useWatch` instead of
  the non-memoizable `react-hook-form` `watch` function.
- The real browser gate now proves:
  - receptionist login → registration → bearer patient search;
  - doctor login → dashboard → bearer queue worklist;
  - nurse login → ward dashboard → bearer nursing tasks;
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

#### P0.4 Security and recovery sign-off

- GitHub issue #368 remains open: `file_access_log.file_id` deletion restriction
  conflicts with DPDP erasure.
- Run authenticated OWASP ZAP and close or formally accept every high/critical
  result.
- Run cross-facility authorization regression from each release role.
- Perform authenticated clinical-journey load tests, not only public health or
  shell-page load.
- Prove backup, restore, rollback and recovery of every stateful service.

### P1 — product completion

#### P1.1 Five remaining named browser gates

Four real roles now pass. The named journeys still missing are:

1. lab technician;
2. radiology technician;
3. pharmacist;
4. billing journey (using its approved receptionist/admin role);
5. patient, blocked by P0.2.

The earlier checklist said “nine additional” but named only eight roles. Count
the named journeys, not the typo. Seed a matching Keycloak account and users row
for every staff role; each test must prove route, role guard, bearer header and
successful business API response.

#### P1.2 Three remaining fixture importers

All are in `frontend/src/features/doctor/api/`:

| File | Real completion needed |
|---|---|
| `consultation.ts` | Wire encounters, SOAP updates, vitals and diagnoses; use the approved ICD service/code set and preserve stale-write behavior. |
| `orders.ts` | Wire order header plus lab/radiology/procedure detail writes; source safe suggestions without inventing a catalog. |
| `breakGlass.ts` | Replace mock access/grants with the existing backend grant/revoke contracts and a real Keycloak MFA step-up/re-auth flow. |

Do not remove the imports by replacing them with empty success responses. A
clinical write must either persist and read back or be visibly unavailable.

#### P1.3 Incomplete operational modules

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
2. Add the lab, radiology and pharmacist Keycloak/users seeds and browser gates.
3. Add the billing browser journey using an already approved role.
4. Retire `consultation.ts` and `orders.ts` fixtures through real write/read-back
   tests.
5. Implement Keycloak MFA step-up and retire `breakGlass.ts` mocks.
6. Resolve issue #368, then run ZAP and authenticated load tests.
7. Run the real-data migration/restore/rollback rehearsal from the exact staging
   release SHA.
8. Merge only reviewed, green PRs to `staging`; soak and sign off.
9. Open a separate `staging` → `main` PR. Never merge a feature branch directly
   into `main`.

## 27 August reality check

A reviewed staging release candidate is still possible by 27 August only if
the sanitized database dump, identity/guardian policy and clinical threshold
decision arrive immediately and scope is frozen. Code can finish the remaining
staff E2Es and doctor wiring quickly; it cannot manufacture those external
approvals or prove a production-data restore without the data.

If any P0 input is missing, keep `main` unchanged and report the release as
blocked by that named gate. Passing static tests is not permission to bypass a
clinical, privacy, recovery or branch-policy control.
