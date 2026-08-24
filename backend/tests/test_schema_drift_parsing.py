"""The schema-drift checker's column tokenizer.

WHY THIS EXISTS

`note` and `notes` were in the checker's NOT_A_COLUMN stop-list, which is meant
to stop prose lines ("Note: the freeze trigger…") inside a fenced block being
read as column names. But `notes` is a genuine column on six tables —
ot_records, prescriptions, doctor_reviews, intake_output_records,
medication_administration and machine_maintenance_logs — so all six were
reported as undocumented no matter what §3 said.

ot_records.notes had in fact been documented all along and still failed. A
warning nobody can clear is worse than no warning: it teaches people to skim
past the checker's output, which is the one thing a gate must not do.

The fix keeps the prose guard but makes it conditional on a type following the
word. These tests pin both directions, because loosening the stop-list is
exactly the change that would otherwise reintroduce the false positives it was
added to prevent.

Same class of bug as the contract checker crashing on an apostrophe: the gate
was wrong, not the thing it was checking.
"""
from __future__ import annotations

import importlib.util
import pathlib

import pytest

_spec = importlib.util.spec_from_file_location(
    "schema_drift_check",
    pathlib.Path(__file__).resolve().parents[1] / "scripts" / "schema_drift_check.py",
)
drift = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(drift)


@pytest.mark.parametrize(
    "line",
    [
        "notes text NULL",
        "notes        text",
        "notes text NOT NULL                      -- 0024. Free text.",
        "note varchar(50)",
    ],
)
def test_notes_is_recognised_as_a_column_when_a_type_follows(line):
    """Six tables have this column. It has to be documentable."""
    assert drift._column_token(line) in {"notes", "note"}


@pytest.mark.parametrize(
    "line",
    [
        "Note: the freeze trigger blocks this",
        "Notes on the partial index below",
        "note that amounts are frozen once issued",
        "Notes — see §4.3",
    ],
)
def test_prose_beginning_with_note_is_still_rejected(line):
    """The reason the stop-word was there in the first place. Loosening the
    rule must not let sentences back in as column names — a phantom column in
    §3 is reported as a MISSING-COLUMN *blocker*, so this failing would break
    the build rather than merely warn."""
    assert drift._column_token(line) == ""


def test_the_ordinary_stop_words_still_apply():
    """`notes` moved out of NOT_A_COLUMN; nothing else did."""
    for line in ("UNIQUE (facility_id, code)", "INDEX ix_orders_patient_id (patient_id)",
                 "CHECK (quantity >= 0)"):
        assert drift._column_token(line) == ""


def test_a_real_column_line_is_unaffected():
    assert drift._column_token("facility_id  UUID NOT NULL → facilities") == "facility_id"
    assert drift._column_token("order_number varchar(30) UNIQUE NOT NULL") == "order_number"


def test_the_shipped_doc_has_no_drift():
    """The whole point, asserted end to end.

    Guards the 57-warning cleanup: a column added by a future migration without
    a §3 entry fails here rather than accumulating silently the way these did.
    """
    doc, versions = drift._locate()
    documented = drift.parse_doc_tables(doc.read_text())
    migrated, _created = drift.parse_migrations(versions)

    undocumented = [
        f"{table}.{column}"
        for table, columns in sorted(migrated.items())
        if table in documented
        for column in sorted(columns - documented[table] - drift.MIXIN_COLUMNS)
    ]

    assert undocumented == [], (
        "columns exist in a migration but not in §3 of docs/database-schema.md: "
        + ", ".join(undocumented)
    )
