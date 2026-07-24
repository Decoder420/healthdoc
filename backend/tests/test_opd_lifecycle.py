"""
backend/tests/test_opd_lifecycle.py

Tests for the OPD lifecycle rules in app/visits/service.py.
These are pure logic tests against ALLOWED_TRANSITIONS -- they don't need
a database, so they're fast and a good place to start (add DB-backed
integration tests separately once your test fixtures/session are set up).
"""
import pytest

from app.opd.service import (
    ALLOWED_TRANSITIONS,
    REASON_REQUIRED_FOR,
    InvalidVisitTransition,
    MissingTransitionReason,
)


class FakeVisit:
    """Minimal stand-in for the SQLAlchemy Visit model in these unit tests."""

    def __init__(self, status: str):
        self.status = status
        self.updated_by = None


def _validate_transition(current_status: str, target_status: str, reason: str | None):
    """
    Mirrors the validation logic in service.transition_visit_status
    without touching the DB, so we can unit test the rules directly.
    """
    allowed = ALLOWED_TRANSITIONS.get(current_status, set())
    if target_status not in allowed:
        raise InvalidVisitTransition(current_status, target_status)
    if target_status in REASON_REQUIRED_FOR and not reason:
        raise MissingTransitionReason(target_status)
    return True


@pytest.mark.parametrize(
    "current_status,target_status",
    [
        ("registered", "in_consultation"),
        ("registered", "cancelled"),
        ("in_consultation", "completed"),
        ("in_consultation", "cancelled"),
    ],
)
def test_legal_transitions_are_allowed(current_status, target_status):
    reason = "patient left" if target_status in REASON_REQUIRED_FOR else None
    assert _validate_transition(current_status, target_status, reason) is True


@pytest.mark.parametrize(
    "current_status,target_status",
    [
        ("registered", "completed"),       # can't skip consultation
        ("completed", "in_consultation"),  # can't reopen a terminal visit
        ("cancelled", "registered"),       # terminal states never reopen
        ("lwbs", "in_consultation"),
        ("in_consultation", "registered"), # can't go backward
    ],
)
def test_illegal_transitions_are_rejected(current_status, target_status):
    with pytest.raises(InvalidVisitTransition):
        _validate_transition(current_status, target_status, reason="x")


def test_lwbs_requires_a_reason():
    with pytest.raises(MissingTransitionReason):
        _validate_transition("registered", "lwbs", reason=None)


def test_cancelled_requires_a_reason():
    with pytest.raises(MissingTransitionReason):
        _validate_transition("in_consultation", "cancelled", reason=None)


def test_lwbs_with_reason_succeeds():
    assert _validate_transition("registered", "lwbs", reason="left after 2 hours")