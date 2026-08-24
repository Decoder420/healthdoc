"""PostgreSQL fixtures for the reports suite.

kpi_snapshots carries uq_kpi_snapshots_facility_code_period, a real unique
constraint from 0025 that the ORM-built SQLite schema does not enforce, and the
overlap query is date arithmetic worth exercising on the engine that ships.
"""
from tests.pg_fixtures import db, engine  # noqa: F401
