"""PostgreSQL fixtures for the facility_modules suite.

facility_modules.config is JSONB and the module_code CHECK constraint exists
only in migration 0027 — neither survives into the ORM-built SQLite schema.
"""
from tests.pg_fixtures import db, engine  # noqa: F401
