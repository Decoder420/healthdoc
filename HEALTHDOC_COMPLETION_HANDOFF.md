# HealthDoc Completion Handoff

**Prepared:** 22 August 2026 · **Last measured:** 24 August 2026, Asia/Kolkata
**Target:** reviewed release candidate on `staging` by end of 27 August 2026
**Working branch:** `release-readiness`, merged into `staging` via #411

Every number in this document was measured on the merged tree. The previous
revision reported 567 tests and figures taken from a branch that had since moved
four times; where a value here differs from an older document, this one is the
measurement.

---

## 1. Verified baseline

| Gate | Result |
|---|---|
| PostgreSQL backend suite | **690 passed**, 0 failed, 0 skipped |
| Migration integrity | **55 migrations, linear, downgrades present, head `0047`** |
| Schema/spec check | **96 tables, 67 enums, map + FKs + ModuleCode consistent** |
| Schema drift | **0 blockers**, 57 documentation warnings |
| API contract matrix | **77/77 frontend calls match OpenAPI** |
| Frontend fixture importers | **15** (was 27) |
| Mounted API endpoints | **198** |
| Frontend TypeScript | Passed |
| Frontend ESLint | 0 errors, 4 pre-existing React-compiler warnings |
| Frontend convention checker | 0 blockers, 0 warnings |
| Nurse Keycloak browser E2E | Passed locally and in CI |

Record the exact promotion SHA before any `main` discussion:

    git fetch origin && git rev-parse origin/staging

**Do not let these numbers fall.** New work should raise the test count.

---

## 2. What changed on 22 August

### All five outstanding contributor PRs resolved — none closed, none abandoned

Each was checked against the tree first. The rule applied was "close only what
is already done elsewhere"; **none qualified**, and three contained real defects
that were fixed rather than worked around.

| PR | Outcome |
|---|---|
| **#405** HOD pending approvals | Merged after rebase. 582 passing; the endpoint existed nowhere else. |
| **#406** Backup/restore, NTP+TLS, load test | Merged after fixing two dev-only assumptions. |
| **#407** QueueToken partial unique index | Merged with migration `0047` after fixing the bug it exposed. |
| **#409** Notification preferences on publish | Merged. Closes the gap filed as #400. |
| **#410** Demo seed for #251 | Merged with an explicit environment gate added. |

### Defects found and fixed

**Queue reassignment had been broken against PostgreSQL since migration 0009.**
`uq_queue_tokens_one_live_per_visit` excluded `completed`, `cancelled` and
`no_show` but not `transferred`. `reassign_token()` marks the old token
transferred and creates a new one for the same visit, so every reassignment
collided with its own history. It stayed invisible because the ORM never
declared the index and **the SQLite test database is built from ORM metadata** —
the constraint did not exist where the tests ran. Fixed forward in `0047`; ORM
and migration now carry the same predicate.

**`POST /visits` accepted `facility_id` from the request body.** `created_by`
was correctly taken from the token; `facility_id` was missed. A receptionist at
facility A could open a visit — and, since `create_visit()` raises the
registration invoice in the same transaction, a billable record — at facility B.
Now taken from the token, with a disagreeing body value refused **403** rather
than silently overridden, so an attempted cross-facility write leaves a trace.

**`users` was cross-tenant in five ways at once (P0.4).** `list_users` took
`facility_id` as an *optional* query parameter — omitting it returned every
staff account in the deployment. `get`, `update`, `activate` and `deactivate`
performed no facility check at all. `create_user` read `facility_id` from the
body, and since Keycloak is written first, could leave a usable credential
inside another hospital. All now scoped to `CurrentDbUser`; foreign ids return
**404, not 403**, because 403 confirms existence and turns the endpoint into an
enumeration oracle for another facility's staff list. Seven tests, each verified
to fail against the old code.

**Backup/restore only worked on a developer laptop.** The scripts required a
`.env` at the repo root and could reach Postgres only by `docker exec` into a
compose container named `healthdoc-postgres-1`. CI has no `.env` and uses a
service container; a managed production database has no container at all — so
the tooling could not run in either place a backup matters most. They now source
`.env` when present and fall back to the environment, and connect over host/port
when no container is available. CI installs `postgresql-client-16` explicitly,
because `pg_dump` refuses to run against a newer server.

### Built

- **Receptionist**: registration, patient search, queue view. Registration runs
  register → visit → token, so it no longer dead-ends at a UHID. Each step holds
  an idempotency key generated at mount, so a double-click replays instead of
  opening a second visit and billing a second registration fee.
- **`GET /queue/queues`**: `POST /queue/tokens` needs a `queue_id` and nothing
  returned one, so a token could not be issued from any screen. Defaults to the
  *facility's* business date, not the server's.
- **Pharmacy**: prescription queue and dispense. Batches render in the server's
  FEFO order and are never re-sorted client-side; expiry buckets separate
  already-expired stock from stock expiring within 30/60/90 days.
- **eMAR** scoped to an admission, with the API extended so a row can name its
  drug rather than returning an opaque `prescription_item_id`.
- **Queue display**: the OPD wall board, and the first `EventSource` in the
  codebase. Unauthenticated by design, matching the backend's PII-free stream.
- **Edge role guard** in `proxy.ts` (Next 16's replacement for `middleware.ts`),
  adding a role check to the existing session-presence check.

---

## 2b. What changed on 23 August

The day's work was P0.4's tail and P1.1 (retiring fixtures). Retiring fixtures
turned out to be the most productive defect-finding activity so far, because
**wiring a mock to a real endpoint is the first time anyone checks the endpoint
exists and returns what the screen assumed.**

### Two production defects, both multi-tenant

**`order_number` collided across facilities — the most serious find.**
`orders.order_number` carries `uq_orders_order_number`, a **global** unique
constraint (0008). The allocator's counter is per `(facility_id, counter_date)`,
and the format embedded no facility code: `ORD-<YYYYMMDD>-<SEQ6>`. So every
facility independently allocates `seq=1` each morning and formats the identical
string. **The second facility to place an order on any given day gets a
UniqueViolation — one hospital's first order of every day, failing permanently.**

`app/opd/visit_number.py` does the identical job correctly
(`VST-<FACILITYCODE>-<YYYYMMDD>-<SEQ5>`). Fixed to match. No migration —
`order_number` is a generated string, not a parsed key, and `String(30)` fits
`ORD-JPR001-20260823-000001` (26 chars). Existing rows keep their old format.

*Why 649 tests missed it:* `tests/_lab_seed.py` inserts a literal
`'ORD-LABTEST-0001'`, so only the OPD journey ever exercised the real allocator
— from one facility. A collision needs two. It surfaced only when a new test
called `POST /orders` from a second facility on the same day.

**`POST /orders` took `created_by` from the request body.** Required field,
written straight to `orders.created_by`, so any caller could file a lab test or
a scan under a colleague's name — while `app/orders/router.py`'s own module
docstring said "created_by comes from current_db_user, never the request body"
(true for `create_prescription` directly below it, false for this one). Now from
the token; a disagreeing body value is refused **403**, not silently overridden.

### Five endpoints that did not exist

Each was found by trying to wire a fixture to it. In every case the mock was
standing in for missing **product**, not missing wiring:

| Endpoint | What was impossible without it |
|---|---|
| `POST /billing/invoices/{id}/issue` | **No invoice could ever be paid.** `build_invoice` creates `draft`, `record_payment` requires `issued`, nothing bridged them. The integration test passed because it ran `UPDATE invoices SET status='issued'` in raw SQL itself. |
| `GET /billing/invoices/{id}` | No way to view an invoice with its lines, receipts and balance. |
| `GET /patients/{patient_id}` | The patient record could not be fetched by id — the first call every clinical screen makes. |
| `GET /radiology/order-items/{id}/reports` | A radiologist could write and sign a report; **nobody could read one back** except via the FHIR bundle. Pathology has had `/results/history` since #218. |
| `GET /orders/results-worklist` | The doctor's "what have I ordered, what came back, what needs sign-off" screen had no backend at all. |

Plus `GET /users/me` (the browser had no way to learn its own facility, so five
modules hardcoded `MOCK_FACILITY_ID` — and *sent* it) and
`GET /allergies/patients/{id}/check` (the prescribing pre-check was
reimplemented in the browser; enforcement was always server-side and correct).

**`GET /pharmacy/medicines/search` did not return `ingredient_code`** — the key
the allergy matcher matches on. Wired as-was, every prescribed item would have
come back "uncheckable": a missing column reading as a missing allergy check, on
every prescription.

### The pattern worth carrying forward

Four times now, a broken module sat directly beside a correct one doing the same
job: radiology vs pathology (report reads), `order_number` vs `visit_number`
(facility code), `create_order` vs `create_prescription` (`created_by`), and
`allergies` vs everything else (facility scoping through a join). **When
auditing, compare siblings.** A module that looks reasonable in isolation often
looks obviously wrong next to the one that got it right.

---

## 2c. What changed on 24 August

Continued P1.1. The same pattern held and hardened into a rule: **a fixture is a
specification of unbuilt backend until proved otherwise.** Every module retired
today had at least one call with no endpoint behind it.

### Controls that had a schema and no code

Four separate cases where a migration created a table, columns were named for a
control, and nothing ever wrote or read them:

| Control | Table | What was impossible |
|---|---|---|
| Maker-checker account requests | `user_account_requests` (0028) | No router, no service, and **nothing imported the model** — so the table was not in `Base.metadata` and existed only in PostgreSQL. `create_user` writes Keycloak first, so an approved request mints a real credential; segregation of duties had no code. |
| Module gating | `facility_modules` (0027) | No ORM model and **no write path**. Whether pharmacy, lab, radiology, OT and blood bank answer at all was configurable only by SQL against production. |
| Compliance ledgers | `data_access_log` (0004), `file_access_log` (0019), `audit_integrity_checks`, `audit_log_archive` (0003) | Tables and no endpoint. 6 of the auditor console's 8 calls were fixture-only. |
| Break-glass revoke/review | `break_glass_grants` (0004) | `revoked_at`/`revoked_by` and `reviewed_at`/`reviewed_by`/`review_outcome` all unwritten. `GET /break-glass/expired-unreviewed` lists grants awaiting review and **nothing could complete one**, so that worklist could only grow. A grant also ran its full two hours with no way to cut it short. |

### The scoping shape that keeps hiding bugs

`data_access_log`, `file_access_log`, `break_glass_grants`, `allergies`,
`radiology_order_items` and `consent_records` have **no `facility_id`**. They
reach a facility only through a join. Every unscoped endpoint found in P0.4 was
on a table of exactly this kind — the missing column is what makes the omission
invisible to a reviewer scanning for `facility_id`.

`data_access_log` adds a second trap: its `patient_id` is **nullable**. The
obvious scoping join is an INNER JOIN, which silently discards every
unattributed row — from the ledger recording who looked at whose data. Those
rows are now included and counted in `unattributed_in_page` instead.

### PR #412 (Kunal, patient search) — closed as superseded, three fixes taken

Branch cut before #411, so its diff showed the receptionist route as a
title-only stub while that route has rendered a working API-backed screen since
22 August. Merging would have replaced live code with a parallel implementation.

Three of its changes were **better than what shipped** and were ported, credited
in the code: UHID/mobile/ABHA input normalisation (a receptionist types a UHID
as printed on the card and an exact-match column never sees it — a real defect
in the live screen), pagination (the screen showed "43 matches" and 20 rows with
no way to the rest), and `isModuleDisabled` error handling. Not taken: a
`globals.css` change removing `label`/`th` from the font-mono rule, which
restyles every form label and table header in the product as a side effect of
styling one table.

*Second Kunal frontend PR superseded by a parallel implementation. The cause is
branch age, not code quality — a coordination problem, not a review one.*

### The contract gate was broken and nobody knew

`make contract` crashed with `unterminated api() call`, naming a well-formed
call. `_call_body` tracked strings but not comments, so an ordinary apostrophe
in a `//` comment inside a call body — `#412's` — opened a quote that never
closed and the scan ran off the end of the file.

Any comment containing "doesn't" or "patient's" would have done it. Block
comments were worse: a `)` in prose would decrement the depth and close the call
early, **silently truncating the parsed body rather than crashing**. Fixed, with
five unit tests on the parser; two fail against the old one, three guard against
over-correction.

---

## 3. Product state, measured

| Measure | Value |
|---|---|
| App routes | 34 |
| Title-only shells | **0** |
| Files calling the API client | **41** (was 3 before the frontend push) |
| Files still importing fixtures | **15** (was 27) |
| Mounted API endpoints | **198** |

The fixture importers remain the honest headline, but the number now means
something different from what it did on 22 August. Then it read as "screens that
demo on fake data". It now reads as **"screens whose backend does not exist"** —
every module retired since had at least one call with nothing behind it.

**Fully retired (12 files):** doctor `patients.ts`, `prescriptions.ts`,
`results.ts`; admin `users.ts`, `accountRequests.ts`, `facilityModules.ts`,
`constants.ts`; audit-viewer `api/audit.ts`, `constants.ts`; both doctor pages;
and the mock modules `doctor_results.ts`, `audit_data.ts`, `admin_data.ts`.

**The 15 that remain, and what each actually needs:**

| Module | Files | Blocker |
|---|---|---|
| Billing | 6 | **Your decision**: may a clerk hand-edit invoice lines before issuing? Charges are aggregated by `build_invoice` and issuing freezes amounts (corrections are cancel-and-reissue), so this is policy, not code. |
| Doctor | 3 | `consultation.ts` needs an **ICD-10 code set** (external input). `orders.ts` needs `suggestOrderNames`/`createProcedure`. `breakGlass.ts` needs `verifyStepUp`, which is Keycloak re-authentication, not an endpoint. |
| Consent | 2 | Per-patient endpoints all exist and are scoped. Only the facility-wide "consent console" list is missing — **deferred by you**; wireable now if the screen takes a patient. |
| Reports | 2 | Genuinely blocked: the reports backend is still a ping route. |
| Lab dashboard | 2 | **Your decision**: `components/dashboards/*` plus `PatientInfo.tsx` (1,281 lines with `lib/mock/lab_data.ts`) are **unreachable** — no route renders them, and `PatientInfo` survives only via a barrel export nothing imports. There are two lab dashboards; the real one is `app/lab/page.tsx`. Delete, or route it and it gets wired. Not wireable as-is: the mock's shape is not the schema, and the charts hardcode `const today = "2026-07-15"`. |

Fixture gate — note `rg` is not installed on this machine, `grep` is:

    grep -rl "@/lib/mock\|@/lib/data" frontend/src --include=*.ts --include=*.tsx | wc -l

Expected end state: **0**.

---

## 4. Remaining work

### P0 — release blockers

**P0.1 Reviewer approval.** Requires a human with merge rights.

**P0.2 Production migration rehearsal.** Tooling exists and now runs in CI;
blocked only on a sanitized dump.

    SOURCE_DUMP=/absolute/path/to/sanitized-main.dump make migration-rehearsal

**P0.3 Verified patient-account identity.** No trustworthy authenticated-user →
patient binding exists; the portal is deliberately fail-closed. Needs a forward
migration after 0047, `/patients/me` endpoints, and an approved
guardian/dependent policy — **the policy itself is an external input**.

**P0.4 Facility and role isolation audit — endpoint sweep complete.**

Every module has now been read. Fixed and covered by tests, each verified to
fail against the un-fixed code: `users` (five ways), `/visits`, `orders`,
`encounters`, patient merge, `billing` (visits, invoices, payments, tariffs),
`allergies`, nursing incident review, and `radiology`.

Confirmed clean without changes: pharmacy, files, emergency, security_audit,
notifications, inventory, wards, reports, blood_bank, ot, registration, outbox,
consent, audit, admissions, departments. Pathology's
`GET /critical-alerts/stream` was flagged by the scan and is **clean on
inspection** — it keys subscribers by `users.id` and publishes only to the
ordering doctor, so the scope is implicit. `queue_display_stream` is the
deliberate public wall board.

**Radiology was the worst module found, and the scan under-reported it.** The
flag was one endpoint; the reality was all six. `radiology_order_items` has no
`facility_id` column — it reaches one only through `order_id -> orders.facility_id`
— so every handler used a bare `db.get()` and compared nothing:

- `GET /order-items` returned every radiology item in the deployment, paged and
  filterable by status, and carried **no role dependency** — a worklist of every
  hospital's scans with accession numbers, to any authenticated account.
- `GET /order-items/{id}/fhir-bundle` also had **no role dependency**, and
  returns a FHIR DiagnosticReport: patient demographics, findings and impression
  in one document, by id.
- `PUT .../reports/sign-off` wrote a **final, signed** report — the version a
  clinician acts on — against another hospital's scan.
- `POST /order-items` attached a scan to another facility's order and allocated
  the accession from *our* counter, putting our sequence on their order.
- `PUT .../scan-complete` and `POST .../reports` were unscoped on the same
  pattern.

The audit trail made it worse rather than better: `_write_audit_log` stamps
`facility_id=current_db_user.facility_id`, so a cross-facility write filed
itself under the caller's facility. The row that should have exposed the act
recorded it against the wrong hospital.

**Lesson for the remaining audit work:** a grep for handlers that never mention
`facility_id` under-counts whenever the table has no `facility_id` of its own.
Radiology and allergies both hid behind that. Reaching facility through a join
is the case worth reading by hand.

**Role-dependency sweep: done, no further holes.** Because two radiology routes
had no role gate at all, every router was scanned for handlers lacking
`require_roles`. Fourteen matched; all fourteen resolve:

- Six in `users` are a false positive — the gate is on the `APIRouter`
  (`dependencies=[Depends(require_roles("admin"))]`), not the handler.
- `queue_display_stream` is the deliberate public wall board.
- The remaining seven (departments, rooms, consent purposes, facility
  capabilities, pathology result history) require authentication and are
  facility-scoped through `CurrentDbUser`; the departments ones carry a comment
  explaining that dropdowns across many modules need them open to any
  authenticated user.

If this scan is repeated, note that a handler-level regex misses router-level
dependencies and will report `users` as ungated when it is not.

**P0.5 Browser gates for every release role.** Only nurse exists; nine to go.
Receptionist and pharmacist became testable on 22 August — before that, their
screens did not exist.

**P0.6 Clinical lab thresholds.** Placeholder haemoglobin range only. **Requires
clinical-owner sign-off**, not code.

### P1 — product completion

**1. Fixture importers: 27 -> 15.** Detail and the per-module blockers are in §3;
the remaining work is either a decision of yours or an external input.

**The rule this produced, which is the most reusable thing here:**

> A fixture is a specification of unbuilt backend until proved otherwise.

Wiring a mock to a real endpoint is the first moment anyone checks the endpoint
exists and returns what the screen assumed. **Eight times** a mock was standing
in for missing product rather than missing wiring:

| What was impossible | Closed by |
|---|---|
| No invoice could ever be paid — `build_invoice` creates `draft`, `record_payment` requires `issued`, nothing bridged them. The integration test passed because it ran `UPDATE invoices SET status='issued'` in raw SQL itself. | `POST /billing/invoices/{id}/issue` |
| No way to view an invoice with its lines, receipts and balance | `GET /billing/invoices/{id}` |
| The patient record could not be fetched by id — the first call every clinical screen makes | `GET /patients/{patient_id}` |
| A radiologist could write and sign a report; nobody could read one back. Pathology has had `/results/history` since #218 | `GET /radiology/order-items/{id}/reports` |
| The doctor's "what have I ordered, what came back, what needs sign-off" screen had no query behind it | `GET /orders/results-worklist` |
| The browser had no way to learn its own facility, so five modules hardcoded `MOCK_FACILITY_ID` — and *sent* it | `GET /users/me` |
| The prescribing allergy pre-check was reimplemented in the browser | `GET /allergies/patients/{id}/check` |
| Maker-checker, module gating, four compliance ledgers, break-glass revoke/review — all tables with no code (§2c) | 11 further endpoints |

Also: **`GET /pharmacy/medicines/search` did not return `ingredient_code`**, the
key the allergy matcher matches on. Wired as-was, *every* prescribed item would
have come back "uncheckable" — a missing column reading as a missing allergy
check, on every prescription.

**A second rule, which found four bugs: compare siblings.** Four times a broken
module sat directly beside a correct one doing the same job — radiology vs
pathology (report reads), `order_number` vs `visit_number` (facility code),
`create_order` vs `create_prescription` (`created_by`), `allergies` vs
everything else (facility scoping through a join). A module that looks
reasonable alone often looks obviously wrong beside the one that got it right.

2. Inventory workflows — backend mutations exist; the frontend shows only alerts.
3. ABDM delivery monitoring — needs sandbox credentials.
4. Radiology — backend contracts exist, the route is unbuilt.
5. Reports/MIS — the reports backend is still a ping route.

### P2 — quality

Document the 57 drift warnings; resolve or formally accept the 4 React-compiler
warnings; close the deferred security TODOs (patient row-version enforcement,
consent gate on patient history, ABAC policy audit logging); accessibility,
keyboard and responsive passes; README, runbook and release notes.

---

## 5. Recommended new gate

**Diff migration-created constraints against ORM `__table_args__`.**

The most valuable finding of 22 August — queue reassignment broken in production
for weeks — was invisible to 589 passing tests because the SQLite fixture builds
schema from ORM metadata. **A constraint that exists only in a migration is
untested by the entire suite.** The same blind spot explains the 15 tables that
exist in migrations with no ORM model (96 in spec, 81 mapped).

A checker that compares the two would have caught it, and would likely find more.

### Two more gates worth having, both earned the hard way

**2. A table with no ORM model is a table with no code.** Four controls found on
24 August had a migration, sometimes a model, and nothing else —
`user_account_requests` was not even in `Base.metadata` because nothing imported
it. A checker that lists tables present in migrations but absent from
`Base.metadata` would have named all four in seconds. It is the same 96-vs-81
gap already noted above, read from the other direction: those 15 unmapped tables
are not a documentation problem, they are unbuilt features.

**3. Test the gates.** `make contract` crashed on valid code for an apostrophe in
a comment, and its block-comment handling would have *silently truncated* a
parsed call body rather than failing. A release gate that can be wrong quietly
is worse than most bugs in the code it checks. `tests/test_contract_checker_parsing.py`
now covers its parser; `spec_check` and `schema_drift_check` have no equivalent.

### Three testing facts worth knowing before writing a guard

- `make test-pg` does **not** make the shared `db` fixture PostgreSQL. It is
  always in-memory SQLite; `test-pg` only supplies a real `DATABASE_URL` to
  tests that open their own engine. A test that skips itself on dialect skips
  **everywhere**, while still reporting a tidy `skipped`.
- Switching branches across a migration boundary leaves the test database ahead
  of the code. Run `make test-db-reset` before `make test-pg` after any such
  switch, or the failure looks like a broken branch rather than a stale database.
- **A suite belongs on PostgreSQL when it touches a PG-only column type or a
  migration-created constraint.** ARRAY and JSONB render on SQLite via
  `@compiles` hooks but cannot bind a Python value; CHECK constraints and
  triggers from migrations do not exist there at all. `tests/pg_fixtures.py` is
  the shared session fixture — import `db, engine` from it rather than
  duplicating an engine per package.

- `make test-pg` does **not** make the shared `db` fixture PostgreSQL. It is
  always in-memory SQLite; `test-pg` only supplies a real `DATABASE_URL` to
  tests that open their own engine. A test that skips itself on dialect skips
  **everywhere**, while still reporting a tidy `skipped`.
- Switching branches across a migration boundary leaves the test database ahead
  of the code. Run `make test-db-reset` before `make test-pg` after any such
  switch, or the failure looks like a broken branch rather than a stale database.

---

## 6. External inputs still required

Release blockers, not tasks. None can be invented:

1. Sanitized production database dump.
2. Clinical-owner approval for critical lab thresholds and units.
3. Approved patient/guardian identity-linking policy.
4. ABDM sandbox credentials and an external UAT contact.
5. Seeded test identities for every release role.
6. A human reviewer with merge rights.
7. An operations owner to accept backup, restore and rollback.

---

## 7. Honest schedule

`main` is **307+ commits behind** `staging` and was last updated on 22 July.

A five-journey release candidate by 27 August is achievable **with four
engineers, frozen scope, and same-day delivery of the external inputs above**.
It is not achievable solo; the realistic single-engineer figure remains 15–25
focused working days, and nothing on 22 August changed that arithmetic.

What did change: the queue of unreviewed contributor work is empty, three
production defects are gone, and the OPD journey is walkable end to end for the
first time — register a patient, open a visit, issue a token, call it, and watch
it appear on the wall display.

Do not open a `staging` → `main` PR until every P0 gate is satisfied and the
evidence in §1 has been re-measured on the exact promotion SHA.

---

## 8. Engineering rules (unchanged)

- Never edit an applied migration; add a forward one.
- Facility scope comes from `CurrentDbUser`, never from the browser.
- Cross-facility ids return 404, not 403.
- Explicit role dependencies on every sensitive route.
- Transactions and row locks for stock, queue and invoice changes.
- Idempotency keys on retried clinical and financial writes.
- Never binary floating point for money.
- Business dates use `(now() AT TIME ZONE facilities.timezone)::date`.
- Never log tokens, Aadhaar, ABHA or patient clinical detail.
- No frontend call without a matching OpenAPI route; no mock fallback on failure.
- Watch a new test fail, and **read why it failed** — three guards this month
  went red for the wrong reason.
