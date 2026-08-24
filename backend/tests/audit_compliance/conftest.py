"""PostgreSQL fixtures for the compliance-ledger suite.

file_access_log.ip_address is INET and data_access_log carries enum-checked
columns; more importantly these endpoints are joins, and a join is exactly the
thing an ORM-built SQLite schema can render while the real constraints and data
shapes differ.
"""
from tests.pg_fixtures import db, engine  # noqa: F401
