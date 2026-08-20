# HealthDoc release-readiness report

**Assessment date:** 2026-08-20
**Working branch:** `codex/release-readiness` from `origin/staging`
**Release intent:** delivery / production-readiness (high confidence)

## Executive decision

Do **not** merge `staging` into `main` yet. The requested release-blocker pack is
implemented locally and the nurse runtime gate now passes, but two external
release gates remain: rehearsal with an actual sanitized production/main dump,
and reviewed GitHub PRs with working repository credentials. The five core
entry worklists are live, but the whole application is not feature-complete.

`origin/main` is currently **304 commits behind** `origin/staging` (`0 304`), not
286. Main's latest commit is `e101e54` from 2026-07-22; staging's latest is
`7a2c7c4` from 2026-08-20. That makes this a controlled release project, not a
routine branch synchronization.

## Requested execution pack

| # | Item | Current status | Evidence / remaining gate |
|---:|---|---|---|
| 1 | Crypto bootstrap, issuer, silent SSO, nurse seed, guards, mock session | **Implemented and runtime-verified** | Generated keys, separate public issuer/JWKS URL, real Keycloak provider, realm/app nurse seed, role-route guards, presence-only navigation cookie, mock session removed. |
| 2 | Nurse browser E2E | **Passing** | Real `dev.nurse` login → `/nurse/ward-dashboard` → Bearer `GET /api/v1/nursing/tasks` 200; silent SSO 200. |
| 3 | Contract matrix / ten invalid calls | **Complete** | Generated matrix reports 17/17 statically discoverable frontend calls in OpenAPI. Unsupported mutations are visibly unavailable instead of silently mocked. |
| 4 | Replace fixtures for OPD, IPD, Lab, Billing, Pharmacy | **Core entry paths complete; deeper product breadth remains** | Live OPD queue/context, IPD wards/beds/admissions/discharges, Lab worklist, Billing invoice queue, Pharmacy prescription queue. Lab/Billing/Pharmacy HTTP journeys pass. Pharmacy dispense mutation remains deliberately disabled pending its item-detail contract. |
| 5 | Main DB 0002 → 0046, backup/restore | **Harness complete; real-data run pending** | Synthetic `origin/main` 0002 upgrade, pre/post backup, restore, revision and seed preservation pass. Must rerun with `SOURCE_DUMP=/path/to/sanitized-main.dump`. |
| 6 | Resolve/replace PR #397 | **Local replacement complete; GitHub operation pending** | PR #397 is an obsolete 319-file/49,514-insertion snapshot forked from July main. Three focused real-Postgres journey tests replace its useful coverage without its duplicate tests, guessed schema or xfail. GitHub CLI credentials are invalid, so it cannot yet be closed or superseded remotely. |
| 7 | Open staging → main PR | **Blocked by design** | Open only after the real dump rehearsal, replacement PR review, core-role UAT, staging soak and rollback sign-off. |

## Verification snapshot

| Gate | Result |
|---|---|
| Backend suite against PostgreSQL | **555 passed** in 22.52s |
| New Lab/Billing/Pharmacy HTTP journeys | **3 passed** |
| Nurse Keycloak browser gate | **PASS** |
| Deep health through NGINX | **200**; PostgreSQL, MongoDB and Redis all `ok` |
| Silent-SSO helper | **200**; CSP allows only same-origin framing |
| Frontend typecheck | **PASS** |
| Frontend lint | **0 errors**, 5 migration warnings |
| Frontend convention check | **0 blockers**, 2 timezone-display warnings |
| Next.js production build | **PASS**, 35 routes generated |
| Dependency audit | **0 known vulnerabilities** |
| Frontend/backend contract | **17/17 valid** |
| Migration chain | **53 linear migrations**, head `0046`, downgrades present |
| Spec checker | **96 tables / 67 enums consistent** |
| Schema drift | **0 blockers**, 57 documentation warnings |
| Synthetic main migration and restore | **PASS**, 0002 → 0046 |

The runtime test discovered and fixed two issues that static checks could not:
macOS native packages were being copied into the Linux frontend container, and
the Next 16 HMR path was being redirected by the route guard. This supports the
decision to keep runtime gates mandatory.

## What “finished” currently means

The five release entry paths can become a production-candidate MVP within ten
days if scope is frozen. The complete product cannot honestly be declared
finished in that window:

- 29 frontend files still directly import `@/lib/data` or `@/lib/mock`.
- 10 routed pages are title-only shells: Emergency, Inventory, Patient Portal,
  Queue Display, nurse eMAR, three Receptionist pages, Admin Departments and
  Admin ABDM Sync.
- Only nurse authentication has a browser E2E. The new Lab, Billing and
  Pharmacy coverage is HTTP/database integration coverage.
- Lab critical thresholds contain only a placeholder haemoglobin rule and need
  clinical-owner approval before production alerts can be trusted.
- 57 schema fields exist in migrations but remain undocumented.
- ABDM requires real environment credentials and external integration UAT.

Therefore:

- **Core five-journey release candidate:** 7–10 calendar days with a focused
  four-person team and frozen scope.
- **Requested technical blocker pack:** 1–2 working days remain once the real
  database dump and GitHub access are supplied.
- **Whole routed product feature-complete:** approximately 4–6 weeks for one
  strong engineer, or 2–3 weeks for a coordinated four-person team, followed by
  clinical/security UAT. This estimate is medium confidence because detailed
  acceptance criteria for the ten shell modules are absent.

## Ten-day crash plan

Minimum team: one frontend engineer, one backend/data engineer, one QA engineer,
and one DevOps/reviewer with a clinical owner available for sign-off.

| Day | Date | Execution | Hard exit criterion |
|---:|---|---|---|
| 1 | Aug 20 | Review and push this focused replacement; restore GitHub access; freeze release scope. | Replacement PR open, two approvals requested, no unrelated 319-file snapshot. |
| 2 | Aug 21 | Rehearse sanitized main/prod dump, backup and restore; record timings and checksums. | 0002/current-main → 0046 and restore both pass on real-shaped data. |
| 3 | Aug 22 | Finish or hide remaining OPD/IPD detail mock paths. | No fixture data can appear in the released OPD/IPD routes. |
| 4 | Aug 23 | Finish or hide remaining Lab/Billing detail mock paths; clinical threshold review. | Released Lab/Billing mutations have contracts and role checks; alert rules signed off. |
| 5 | Aug 24 | Complete Pharmacy item-detail/dispense contract or keep dispense unavailable. | No fake dispensing success; stock ledger/reorder invariants pass. |
| 6 | Aug 25 | Add browser gates for receptionist/doctor/lab/pharmacist core journeys. | Keycloak roles, redirects and bearer requests pass for all release roles. |
| 7 | Aug 26 | Security, tenancy and failure-path test; UAT round one. | No cross-facility access, no open critical/high dependency findings, UAT defects triaged. |
| 8 | Aug 27 | Merge focused replacement to staging; code freeze; rerun all gates. | Green CI on staging and release artifact identified by commit SHA. |
| 9 | Aug 28 | 24-hour staging soak, restore drill, rollback rehearsal and UAT sign-off. | Monitoring clean; measured restore/rollback accepted by operations. |
| 10 | Aug 29 | Open staging → main PR, final review, maintenance-window deployment and post-deploy smoke. | Approved PR, backup captured, deployment smoke green, rollback window retained. |

Any failure of the real-data migration, role E2E, clinical sign-off or rollback
drill is a release stop—not a reason to compress the gate.

## Root-cause and risk diagnosis

| Diagnosis | Evidence | Confidence |
|---|---|---|
| Primary: repository fragility | Static green state coexisted with dead imports, invalid API calls, edited historical schema assumptions, host/container native-package leakage and unexecuted auth. | High |
| Secondary: verification gap | Keycloak, bearer propagation, silent SSO and real rows had no browser execution before this work. | High |
| Legitimate complexity | 304-commit divergence, 53 migrations, multi-store infrastructure and healthcare role/tenancy controls make a blind merge materially unsafe. | High |
| Specification gap | “Whole project finished” has no acceptance criteria for ten shell modules or external ABDM behavior. | High |

The best speed lever is scope discipline: ship the five verified clinical and
financial journeys, visibly disable every incomplete route, and schedule the
remaining modules after the production baseline is safely synchronized.
