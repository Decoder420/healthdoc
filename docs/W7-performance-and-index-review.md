# W7 — Performance & index review (BA-W7-02)

## Redis caching

Implemented in PR #428. `backend/app/common/cache.py` is a versioned JSON cache
that fails open to PostgreSQL. Facility capabilities are cached for five minutes
and invalidated only after a module-toggle transaction commits. Hit, TTL,
corrupt/outage fallback and invalidation ordering are regression-tested.

## N+1 review checklist (run per module before W7 sign-off)
- [x] patient history — bounded set queries; no query inside a result loop
- [x] queue board — batched tokens/doctors/rooms; emergency escalation is one join
- [x] billing invoice view — set-based invoice/item/payment queries
- [x] lab/radiology worklist — joined, grouped worklist queries

The three defects found by the AST sweep are fixed in PR #427. A structural
test rejects any future `await db.execute/get/scalar` inside those reviewed
loops.

## Index review (verify these exist; schema §3 + index addendum)
- [x] every FK has a complete, non-partial leading index (migration 0050)
- [x] `ix_visits_patient_id_visit_date`, `ix_orders_order_type_status`
- [x] `audit_logs` / `data_access_log` indexes on user/patient plus timestamp
- [x] `ix_inventory_batches_fefo` partial WHERE quantity > 0
- [x] partial unique for current results/dispenses and active UHID
- [x] BRIN on audit `created_at` and access-log `accessed_at`
- [x] `jsonb_path_ops` GIN on lab results and notification payloads

`tests/test_performance_indexes.py` queries `pg_constraint`, `pg_index` and
`pg_indexes` against migrated PostgreSQL. It fails on any uncovered FK or any
missing/misshapen named hot index. Query-plan performance at realistic volume
is measured by the #244 load rehearsal rather than inferred from an empty DB.
