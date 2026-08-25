"""PostgreSQL fixtures for break-glass revoke/review.

break_glass_grants carries ck_break_glass_grants_justification_length and FKs to
users.id on revoked_by / reviewed_by — none of which the ORM-built SQLite schema
enforces. The FK is the point of several of these tests.
"""
from tests.pg_fixtures import db, engine  # noqa: F401
