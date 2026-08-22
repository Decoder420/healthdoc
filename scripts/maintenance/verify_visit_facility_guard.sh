#!/usr/bin/env bash
# Reverts the facility fix, runs the guard, restores. Run from backend/.
set -euo pipefail
cp app/opd/service.py /tmp/opd_service.bak
python3 - <<'PY'
import pathlib
p = pathlib.Path("app/opd/service.py")
s = p.read_text()
s = s.replace("seq = await visit_number.next_visit_sequence(db, facility_id, business_date)",
              "seq = await visit_number.next_visit_sequence(db, payload.facility_id, business_date)")
s = s.replace("        facility_id=facility_id,\n        department_id=payload.department_id,",
              "        facility_id=payload.facility_id,\n        department_id=payload.department_id,")
p.write_text(s)
print("BUG REINTRODUCED: service reads payload.facility_id")
PY
set +e
make -C .. test-pg p=tests/opd
echo "--- exit: $? (non-zero = the guard works) ---"
set -e
cp /tmp/opd_service.bak app/opd/service.py
echo "restored"
