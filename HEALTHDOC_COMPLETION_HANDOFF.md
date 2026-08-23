# HealthDoc Completion Handoff

**Prepared:** 22 August 2026, Asia/Kolkata
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
| PostgreSQL backend suite | **649 passed**, 0 failed, 0 skipped |
| Migration integrity | **54 migrations, linear, downgrades present, head `0047`** |
| Schema/spec check | **96 tables, 67 enums, map + FKs + ModuleCode consistent** |
| Schema drift | **0 blockers**, 57 documentation warnings |
| API contract matrix | **59/59 frontend calls match OpenAPI** |
| Frontend fixture importers | **25** (was 27) |
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

## 3. Product state, measured

| Measure | Value |
|---|---|
| App routes | 34 |
| Title-only shells | **0** — 3 thin pages render real feature components |
| Files calling the API client | **38** (was 3 before the frontend push) |
| Files still importing fixtures | **25** (was 27) |

The fixture importers are the honest headline. They are concentrated in
Doctor (6, was 8), Billing (6), Admin (5), Consent/Audit (4), Reports (2) and
two shared components. Those screens exist and demo convincingly on data from a
TypeScript file, which makes them the most misleading thing in the build.

Fully retired so far: `features/doctor/api/patients.ts` and
`features/doctor/api/prescriptions.ts`. `results.ts` is partially wired — its
two result reads now call real endpoints; its review lifecycle still uses
fixtures, and is unblocked now that `GET /orders/results-worklist` returns
`encounter_id` (the mock omitted it, which is why the review lifecycle filed
everything against one hardcoded encounter).

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

1. **Retire the 27 fixture importers** (Doctor 8, Billing 6, Admin 5,
   Consent/Audit 4, Reports 2, 2 shared).

   The prerequisite is now built. Five of those modules re-exported
   `FACILITY_ID = MOCK_FACILITY_ID` because **nothing on the wire told the
   browser which facility it was in** — there was no `/me` endpoint and no
   session claim. That constant was not merely cosmetic: `CreateUserModal` and
   `CreateAccountRequestModal` *sent* it as `facility_id` in the request body.
   Since `POST /users` now refuses a disagreeing body `facility_id` with 403,
   both screens would have failed on every submission the moment they were
   wired to the real API — a mock that was concealing a broken contract rather
   than standing in for a working one.

   `GET /users/me` now returns the caller's id, username, full name, token
   roles and facility (id, code, name, timezone). Deliberately narrow — no
   email, mobile, employee_id or registration_number — since every role reads
   it. `useCurrentUser()` consumes it with **no fallback**: a screen that
   cannot identify its facility renders blank rather than a plausible wrong
   name, because the facility label is what a user checks to confirm they are
   looking at their own hospital's data.

   Route ordering is load-bearing and guarded by a test: `/users/me` must be
   registered before `app.users.router`'s `GET /users/{user_id}`, or "me" is
   parsed as a UUID and the endpoint 422s. `app/users/me.py` is a separate
   router because `/users` is admin-gated at the APIRouter level and `/me` must
   be readable by every role.

   **The finding that changes how to approach the rest.** These mocks are not
   only standing in for missing *wiring*. Three times now they were standing in
   for missing *product*, and each was invisible until someone tried to wire the
   call behind them:

   - **No invoice could ever be paid.** `build_invoice` creates `draft`,
     `record_payment` accepts only `("issued","partially_paid")`, and nothing in
     the application bridged them. The integration test passed because it ran
     `UPDATE invoices SET status='issued'` in raw SQL itself. Fixed by
     `POST /billing/invoices/{id}/issue`.
   - **No `GET /patients/{patient_id}`.** A patient could be created, searched,
     updated and have their history read — but the record could not be fetched
     by id, which is the first call every clinical screen makes.
   - **`GET /pharmacy/medicines/search` did not return `ingredient_code`** — the
     key the allergy matcher matches on. Wired as-was, *every* prescribed item
     would have come back "uncheckable": a missing column reading as a missing
     allergy check, on every prescription.

   Treat each remaining mock module as a specification of possibly-unbuilt
   backend, not a list of calls to swap in. Read what the endpoint actually
   returns before assuming the mock's shape was ever real.

   Endpoints added to close these: `GET /users/me`,
   `POST /billing/invoices/{id}/issue`, `GET /billing/invoices/{id}`,
   `GET /patients/{patient_id}`, `GET /allergies/patients/{id}/check`.

   Retired so far — **27 -> 25**: `features/doctor/api/patients.ts` and
   `features/doctor/api/prescriptions.ts`. Doctor is 8 -> 6.

   Still fixture-backed, with what each needs:

   | Module | Files | Missing backend |
   |---|---|---|
   | Doctor | 6 | `searchIcd` (needs an ICD-10 code set — **external input**), `suggestOrderNames`, `createProcedure`, results worklist, radiology report reads, 3 of 4 break-glass calls, `mockEncounterContext` on 2 pages |
   | Billing | 6 | draft line editing (add/update/remove item) and `resolveTariff` — **a product decision**, since charges are aggregated by `build_invoice` and issuing freezes amounts |
   | Admin | 5 | account-request endpoints exist at `app/users/account_requests.py`; needs wiring, not building |
   | Consent/Audit | 4 | not yet surveyed |
   | Reports | 2 | reports backend is still a ping route |

   `mockMedicines` is now dead and can be deleted.
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

### Two testing facts worth knowing before writing a guard

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
