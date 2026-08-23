"""PostgreSQL fixtures for the maker-checker account-request suite.

user_account_requests.requested_roles is ARRAY(Text), which the shared SQLite
fixture renders as TEXT but cannot bind a Python list to, and
ck_user_account_requests_requester_ne_approver — the constraint this whole
suite is about — does not exist in the ORM-built schema at all.
"""
from tests.pg_fixtures import db, engine  # noqa: F401
