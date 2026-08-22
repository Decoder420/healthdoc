# HealthDoc Project Completion Handoff

**Prepared:** 22 August 2026, Asia/Kolkata  
**Target:** release candidate on <code>staging</code> by end of 27 August 2026  
**Repository:** HealthDoc  
**Working branch:** <code>release-readiness</code>  
**Current release commit:** <code>4551346</code>  
**Open pull request:** [#411 — Release readiness: complete clinical journeys](https://github.com/IUI-Solutions-HealthDoc/healthdoc/pull/411)  

This is the current execution brief and source of truth for completing the
project. The older <code>docs/release-readiness.md</code> report is useful
history but contains an old branch name, old commit counts, and old test totals.

## 1. Mission and completion definition

By 27 August, produce a reviewed release candidate on <code>staging</code>.
Do not merge directly to <code>main</code> and do not open a
<code>staging</code> to <code>main</code> PR until every production gate in
this file is satisfied.

“Finished” means:

1. Every enabled route reads and writes real, facility-scoped backend data.
2. No enabled screen shows fake success or clinical data from fixtures.
3. All authentication, role, facility and patient-identity boundaries are
   verified in browser and backend tests.
4. The essential journeys work end to end: OPD, IPD, Lab, Billing, Pharmacy,
   Emergency, Inventory, Patient Portal, Administration and Radiology.
5. A sanitized copy of the actual production/main database upgrades through
   migration <code>0046</code>, backs up, restores and passes integrity checks.
6. CI, core-role browser tests, staging UAT, rollback rehearsal and reviewer
   approval are green.

If an external dependency or product decision is unavailable, fail closed and
record it as a release blocker. Never substitute mock data or guess a healthcare
security/clinical rule.

## 2. Current Git and release state

- <code>release-readiness</code> is clean and tracks
  <code>origin/release-readiness</code>.
- PR #411 targets <code>staging</code>, is mergeable and requires human review.
- PR #411 CI is green: backend, frontend and nurse-auth E2E all passed.
- Conflicting 410-file PR #397 is closed and superseded by #411.
- The old <code>codex/release-readiness</code> branch was deleted.
- Do not create branch names beginning with <code>codex/</code>. Use names such
  as <code>finish/patient-identity</code>,
  <code>finish/inventory-workflows</code> or
  <code>fix/facility-scoping</code>.
- As of 22 August, <code>main</code> is 307 commits behind
  <code>staging</code>. Main was last updated on 22 July.

Start from the latest release branch:

    git fetch origin --prune
    git switch release-readiness
    git pull --ff-only origin release-readiness

For parallel work, create small branches from
<code>origin/release-readiness</code> and target them back into
<code>release-readiness</code>. Keep each PR reviewable and avoid another
hundreds-of-files replacement PR.

## 3. Work already completed

### Authentication and runtime

- Real Keycloak bootstrap, PKCE flow and silent SSO are wired.
- <code>silent-check-sso.html</code> serves successfully through NGINX.
- Nurse seeding and role-to-route mapping are working with a real token.
- Route guards are role aware and mock-session behavior has been removed.
- A browser gate proves:
  nurse login → <code>/nurse/ward-dashboard</code> → bearer-authenticated
  <code>GET /api/v1/nursing/tasks</code> returning 200.
- Frontend Docker development now keeps Linux dependencies isolated from host
  macOS <code>node_modules</code> and does not mutate repository lockfiles.

### Pharmacy

- Live prescription lookup and medicine/batch selection.
- <code>POST /pharmacy/dispenses</code> is connected.
- Quantity, duplicate-item, facility, prescription and batch validation.
- Expiry override reason and substitution reason validation.
- Doctor-specific pending substitution queue.
- Doctor approval/rejection screen at
  <code>/doctor/pharmacy-approvals</code>.
- Ordering-doctor and cross-facility checks.
- Integration tests cover the critical dispense and approval paths.

### Lab

- Live order-item worklist and sample collection.
- Result JSON entry and result history.
- Duplicate-result protection and sample-before-result enforcement.
- Doctor verification.
- Critical numeric validation.
- Doctor-only critical-alert SSE stream is consumed by the frontend with
  reconnect and toast behavior.

### Nurse and IPD

- Nurse/IPD fixture imports are now zero.
- Ward dashboard uses live wards, beds, admissions, discharges and nursing
  tasks.
- Vitals, fluid balance, eMAR, patient movement, task completion and discharge
  summary reads/writes use published contracts.
- Nursing and admission queries are facility scoped.

### Other screens

- Emergency THID registration is live.
- Inventory reorder alerts and expiry tracking are live.
- Admin Departments supports live department/room list, create and activation
  changes.
- Admin ABDM supports facility patient search plus ABHA inspect and unlink.
- Patient Portal no longer accepts an arbitrary patient UUID. It fails closed
  until a verified account-to-patient relationship exists.
- Sidebar links for the new live screens are present.

### Contracts, schema and migrations

- Generated frontend/backend contract matrix: 51 of 51 discovered calls valid.
- Ten previously invalid calls were fixed or explicitly disabled.
- Migration chain: 53 linear migrations with downgrades, head
  <code>0046</code>.
- Schema/spec checker: 96 tables and 67 enums consistent.
- Synthetic <code>origin/main</code> migration rehearsal from
  <code>0002</code> through <code>0046</code>, backup and restore passed.
- Actual production data has not yet been supplied or rehearsed.

## 4. Latest verified baseline

| Gate | Result |
|---|---|
| PostgreSQL-backed backend suite | **567 passed** |
| Frontend TypeScript | **Passed** |
| Frontend ESLint | **0 errors, 4 existing React compiler warnings** |
| Next.js production build | **Passed, 36 routes** |
| Frontend convention checker | **0 blockers, 0 warnings** |
| API contract checker | **51/51 valid** |
| Nurse Keycloak browser E2E | **Passed locally and in CI** |
| Migration integrity | **53 linear migrations, head 0046** |
| Schema/spec check | **96 tables, 67 enums** |
| Schema drift | **0 blockers, 57 documentation warnings** |
| Synthetic main backup/upgrade/restore | **Passed** |
| PR #411 CI | **Backend, frontend and nurse-auth E2E passed** |

Do not reduce these numbers. New tests should increase the backend total.

## 5. Remaining work, in strict priority order

### P0 — release blockers

#### P0.1 Review and merge PR #411 into staging

- Obtain the required human review.
- Resolve review comments with focused commits on
  <code>release-readiness</code>.
- Do not bypass branch protection.
- After merge, rerun all gates on the resulting <code>staging</code> SHA.

Acceptance:

- PR #411 approved and merged.
- Backend, frontend and nurse-auth jobs green on the exact staging commit.
- The release candidate SHA is recorded.

#### P0.2 Rehearse the actual production/main database

The existing rehearsal used a synthetic main-shaped database. Obtain a
sanitized production/main dump and run:

    SOURCE_DUMP=/absolute/path/to/sanitized-main.dump make migration-rehearsal

Verify:

- source dump restores without manual changes;
- current revision is detected correctly;
- upgrade reaches <code>0046</code>;
- application seed/reference rows remain valid;
- pre-upgrade backup and post-upgrade backup both restore;
- table counts and critical business totals are reconciled;
- duration, disk requirement, checksums and rollback time are recorded.

Any failure is a release stop. Never alter an already-released migration to make
the rehearsal pass; add a new forward migration.

#### P0.3 Implement verified patient-account identity

Current state: the database has no trustworthy authenticated-user to patient
binding. The portal is intentionally fail-closed.

Required implementation:

- Add an auditable facility-scoped patient/account link model and forward
  migration after <code>0046</code>.
- Define verified creation, revocation and re-verification behavior with the
  security/product owner. Support guardian/dependent access only if explicitly
  approved.
- Resolve the portal patient from the authenticated Keycloak/Postgres user,
  never from a URL-supplied patient UUID.
- Add self-service endpoints such as <code>/patients/me</code> and
  <code>/patients/me/...</code>; never expose a general patient lookup to the
  patient role.
- Log portal access and sensitive changes.
- Enforce facility and active-link status in every query.
- Replace the fail-closed Patient Portal page with live demographics,
  consent/access information and the approved clinical subset.

Required tests:

- patient can access only their linked record;
- another patient UUID cannot be selected or inferred;
- revoked/unverified link returns 403;
- guardian access follows the approved model;
- cross-facility links and data return 404/403 without leaking existence;
- access is audited.

#### P0.4 Complete facility and role isolation audit

Audit every endpoint touched while replacing fixtures. A known high-risk area is
<code>backend/app/users/router.py</code>: list filtering, get, update,
activate/deactivate and create must be scoped to the authenticated admin's
facility unless a separately approved platform-admin role exists.

Requirements:

- derive facility from <code>CurrentDbUser</code>, not a caller-controlled
  query/body field;
- scope reads, writes and relationship checks;
- verify role dependencies on every route;
- use 404/403 consistently without cross-facility existence leaks;
- test same-facility success and cross-facility rejection for every module;
- cover Patients, Users, Departments, Admissions, Nursing, Orders, Pharmacy,
  Pathology, Billing, Consent, Audit, ABDM and Radiology.

#### P0.5 Add browser gates for every release role

Only the nurse currently has a real browser E2E.

Add seeded Keycloak E2Es for:

1. receptionist: login → patient search/register → visit → queue token;
2. doctor: login → worklist/encounter → order/prescription → result review;
3. lab technician: login → collect sample → enter result;
4. doctor lab verification and critical alert reception;
5. pharmacist: login → prescription → dispense;
6. ordering doctor: substitution approve/reject;
7. billing: invoice → payment/refund according to role policy;
8. admin: departments/users and facility boundaries;
9. patient: linked self record only;
10. radiology: worklist → scan completion → report → sign-off.

Every test must prove the redirect, at least one real row, the
<code>Authorization: Bearer</code> header and the expected HTTP status.

#### P0.6 Approve clinical lab thresholds

Current code contains only a placeholder haemoglobin critical range in
<code>backend/app/pathology/router.py</code>.

- Move clinically approved thresholds into a controlled configuration or
  facility-aware reference table.
- Define units, age/sex applicability, boundary inclusivity and missing-unit
  behavior.
- Obtain clinical-owner sign-off.
- Test low, high, boundary, nonnumeric, missing and unit-mismatch cases.
- Do not ship unapproved critical-alert rules as clinical truth.

### P1 — product completion

#### P1.1 Remove all remaining fixture imports

There are 27 current importers of <code>@/lib/mock</code>. Nurse/IPD is already
clean. Replace every remaining importer with live API state, authenticated
context or an honest unavailable/error state.

Doctor:

- <code>frontend/src/app/doctor/orders/page.tsx</code>
- <code>frontend/src/app/doctor/prescriptions/page.tsx</code>
- <code>frontend/src/features/doctor/api/breakGlass.ts</code>
- <code>frontend/src/features/doctor/api/consultation.ts</code>
- <code>frontend/src/features/doctor/api/orders.ts</code>
- <code>frontend/src/features/doctor/api/patients.ts</code>
- <code>frontend/src/features/doctor/api/prescriptions.ts</code>
- <code>frontend/src/features/doctor/api/results.ts</code>

Billing:

- <code>frontend/src/features/billing/api/chargeMaster.ts</code>
- <code>frontend/src/features/billing/api/invoices.ts</code>
- <code>frontend/src/features/billing/api/mis.ts</code>
- <code>frontend/src/features/billing/api/payments.ts</code>
- <code>frontend/src/features/billing/api/visits.ts</code>
- <code>frontend/src/features/billing/constants.ts</code>

Admin:

- <code>frontend/src/features/admin/api/accountRequests.ts</code>
- <code>frontend/src/features/admin/api/facilityModules.ts</code>
- <code>frontend/src/features/admin/api/users.ts</code>
- <code>frontend/src/features/admin/constants.ts</code>
- <code>frontend/src/lib/mock/admin_data.ts</code>

Consent and audit:

- <code>frontend/src/features/consent/api/consent.ts</code>
- <code>frontend/src/features/consent/constants.ts</code>
- <code>frontend/src/features/audit-viewer/api/audit.ts</code>
- <code>frontend/src/features/audit-viewer/constants.ts</code>

Reports/shared:

- <code>frontend/src/features/reports/api/kpis.ts</code>
- <code>frontend/src/features/reports/constants.ts</code>
- <code>frontend/src/components/dashboards/LabDashboardCharts.tsx</code>
- <code>frontend/src/components/ui/PatientInfo.tsx</code>

Doctor pages must derive encounter/patient context from a real worklist or
selected encounter, not <code>mockEncounterContext</code>.

Acceptance command:

    rg -n '@/lib/mock|@/lib/data' frontend/src -g '*.ts' -g '*.tsx'

Expected result: no output. Once all consumers are gone, delete unreachable
fixture modules and ensure production bundles contain no demo clinical data.

#### P1.2 Complete Inventory workflows

The backend already has mutation routes for GRN creation/verification, indent
creation/approval/issue and adjustment creation/approval. The frontend currently
shows only reorder alerts and expiry tracking.

Implement:

- facility-scoped list/detail/review endpoints for GRNs, indents and
  adjustments where missing;
- live worklists and forms in <code>/inventory</code>;
- batch, supplier, location, medicine and quantity selection from real data;
- maker-checker/dual-approval rules;
- atomic stock ledger updates with row locks;
- idempotency on retryable writes;
- validation for expiry, negative stock, duplicate items and cross-facility
  references;
- visible pending/approved/rejected/issued states;
- integration tests for concurrent stock changes and approval separation.

Remove any stale text claiming dispense mutations are unavailable when the live
dispense flow is already connected.

#### P1.3 Complete ABDM administration

Current screen can search a facility patient and inspect/unlink ABHA. Delivery
monitoring is explicitly unavailable.

Implement:

- facility-scoped outbox/list endpoint with status, attempt count, safe error
  summary and timestamps;
- filter and detail UI for queued, sent, retrying and failed events;
- authorized retry behavior with idempotency and audit logging;
- PII-safe logs and UI;
- sandbox credential configuration and ABDM external UAT;
- failure, timeout, token-expiry and duplicate-delivery tests.

Do not put ABDM secrets or real identifiers in the repository or test output.

#### P1.4 Complete Radiology

The route <code>/radiology</code> is still a title-only shell. Backend contracts
already exist for worklist, scan completion, report draft, report sign-off and
FHIR bundle retrieval.

Build:

- live facility worklist;
- scan-complete action;
- report draft/edit flow;
- authorized sign-off;
- report/FHIR download;
- loading, empty, failure and permission states;
- radiology-technician and radiologist/doctor integration and browser tests.

#### P1.5 Complete Reports/MIS

The reports backend currently exposes only a ping route while frontend report
features still use fixtures.

- Agree the required release KPIs and sources.
- Implement facility-scoped report endpoints with date range, timezone and
  pagination rules.
- Connect KPI, billing MIS and lab charts to live responses.
- Reconcile report totals against source tables in PostgreSQL tests.
- Define money rounding and timezone boundaries explicitly.
- Ensure exports cannot cross facility scope.

#### P1.6 Finish Doctor, Billing, Admin, Consent and Audit live flows

Doctor:

- real worklist-selected encounter/patient context;
- consultation, orders, prescriptions, break-glass and result review through
  live contracts;
- audit break-glass reason and expiry;
- no provisional/mock encounter presented as saved clinical data.

Billing:

- live visits, invoice preview/build, payment, refund, tariff and MIS APIs;
- idempotency for financial writes;
- exact decimal money handling;
- role separation and facility scoping;
- reconciliation tests.

Admin:

- replace mock users, account requests and facility modules;
- fix backend user facility isolation before enabling the UI;
- verify Keycloak and Postgres changes remain consistent on partial failure.

Consent/Audit:

- connect published consent routes and audit log/export routes;
- implement the missing patient-data access-log API if it is part of the
  release;
- make consent enforcement explicit on protected clinical history;
- never silently fall back to fixtures when the backend fails.

### P2 — quality and documentation closure

1. Document the 57 migration/schema fields currently reported as warnings.
2. Resolve the four React compiler warnings around React Hook Form
   <code>watch()</code> usage or document why compiler opt-out is acceptable.
3. Resolve deferred security TODOs:
   - patient row-version header enforcement;
   - consent gate on patient history;
   - ABAC policy-evaluation audit logging;
   - per-facility system actor design.
4. Remove stale comments/messages that contradict completed behavior.
5. Add a favicon or filter its expected 404 from browser smoke logging.
6. Run accessibility, responsive-layout and keyboard checks on every released
   workflow.
7. Update README, operations runbook, API documentation and release notes.

## 6. Five-day execution schedule

This schedule assumes at least three implementers plus a reviewer/QA owner and
fast access to a clinical owner and sanitized production dump. One engineer
cannot safely complete every item above by 27 August; the honest solo estimate
is approximately 15–25 focused working days.

| Date | Primary work | Required exit criterion |
|---|---|---|
| **22 Aug** | Review/merge #411; freeze scope; obtain production dump, ABDM sandbox access and clinical owner; split P0/P1 into focused branches. | Inputs and owners assigned; no unreviewed direct main work. |
| **23 Aug** | Patient-account binding, patient portal, users/admin facility isolation; start real database rehearsal. | Identity and cross-facility tests green; real dump upgrade/restore result recorded. |
| **24 Aug** | Retire Doctor, Billing, Admin, Consent and Audit fixtures; connect live encounter context and financial paths. | No fake data in these enabled routes; contract checker and focused integration tests green. |
| **25 Aug** | Inventory workflows, ABDM delivery monitoring, Radiology and Reports; clinical threshold approval. | Worklists/mutations live and scoped; clinical rules signed off; remaining fixture scan approaching zero. |
| **26 Aug** | Complete remaining fixture removal; add all role browser E2Es; security/tenancy regression; core-role UAT. | Zero fixture imports; all backend/frontend/browser gates green; no open critical/high defects. |
| **27 Aug** | Merge focused PRs to staging, code freeze, rebuild, full regression, migration/rollback evidence and final review. | Green exact staging SHA, signed UAT, backup/restore/rollback accepted. Only then consider staging → main. |

If a P0 gate fails, do not consume 27 August by hiding the failure. Keep
<code>main</code> unchanged and report the exact blocker.

## 7. Mandatory engineering rules

- Never edit an applied migration. Add a new forward migration.
- Use <code>CurrentDbUser</code> or the approved authenticated context for
  facility scoping. Do not trust facility IDs from the browser.
- Check every related row belongs to the same facility before mutation.
- Use explicit role dependencies on all sensitive routes.
- Use database transactions and row locks for stock, queue, invoice and other
  concurrency-sensitive changes.
- Use idempotency keys for retried clinical/financial writes.
- Never use binary floating point for money.
- Store timestamps in UTC and format them through the shared timezone helpers.
- Never log tokens, Aadhaar, ABHA, patient clinical details or secrets.
- Do not add a frontend API call without a matching backend OpenAPI route.
- Do not add mock fallback behavior on API failure.
- Unsupported capability must be disabled or gated visibly.
- Every fix needs success, validation, authorization, cross-facility and
  failure-path tests.
- Preserve unrelated work and do not rewrite shared Git history.
- Do not commit <code>.env</code>, dumps, browser artifacts,
  <code>node_modules</code>, <code>.next</code> or unintended lockfile changes.

## 8. Verification commands

Run from the repository root unless noted:

    make up
    make migrate
    make test-pg
    make contract

    cd backend
    ../.venv/bin/python scripts/check_migration_integrity.py
    ../.venv/bin/python scripts/spec_check.py ..
    ../.venv/bin/python scripts/schema_drift_check.py
    cd ..

    cd frontend
    npm run typecheck
    npm run lint
    node scripts/fe_check.mjs
    npm run build
    npm run test:e2e
    cd ..

    git diff --check
    git status --short

Fixture gate:

    rg -n '@/lib/mock|@/lib/data' frontend/src -g '*.ts' -g '*.tsx'

API contract output must remain 100% valid and
<code>docs/api-contract-matrix.md</code> must be regenerated, not manually
edited.

Production-data rehearsal:

    SOURCE_DUMP=/absolute/path/to/sanitized-main.dump make migration-rehearsal

Before proposing promotion:

    git fetch origin --prune
    git rev-list --left-right --count origin/main...origin/staging
    git diff --stat origin/main...origin/staging

## 9. Review checklist for generated code

For every PR, reviewers must answer:

- Does this use real data with no fixture fallback?
- Is every read and write facility scoped?
- Can a lower role or patient select another user's UUID?
- Are associated IDs validated before writes?
- Are retries idempotent?
- Are stock/financial changes transactional and concurrency safe?
- Are PII, tokens and secrets absent from logs?
- Does OpenAPI match the frontend call exactly?
- Are error, empty, loading and permission states visible?
- Are migrations forward-only and reversible?
- Do PostgreSQL tests cover success, invalid input, wrong role and wrong
  facility?
- Is there a browser test proving a real token and real response?
- Did package lockfiles change intentionally?
- Does the PR state what remains incomplete?

Reject generated code that only makes TypeScript compile, catches and ignores
API errors, invents backend response shapes, weakens role checks, removes
failing tests or replaces live failures with demo data.

## 10. Required external inputs

These cannot be safely invented by a coding agent:

1. Sanitized production/main database dump.
2. Clinical-owner approval for critical lab thresholds and units.
3. Approved patient/guardian identity-linking policy.
4. ABDM sandbox credentials and external UAT contact.
5. Seeded test identities for every release role.
6. Human reviewer with permission to approve PR #411 and subsequent PRs.
7. Operations owner for backup, restore, rollback and maintenance-window
   acceptance.

Record unavailable inputs immediately. They are release blockers, not coding
tasks.

## 11. Final release evidence required

The final handoff on 27 August must contain:

- exact staging commit SHA;
- merged PR list;
- backend/frontend/E2E results and links;
- zero-fixture scan output;
- final API contract matrix result;
- sanitized production migration, backup and restore report;
- cross-facility security test result;
- clinical and UAT sign-offs;
- known nonblocking issues;
- deployment and rollback commands;
- owner and timestamp for the go/no-go decision.

Only after all evidence is present should a reviewed
<code>staging</code> to <code>main</code> PR be opened. Production deployment
must retain the verified backup and rollback window.
