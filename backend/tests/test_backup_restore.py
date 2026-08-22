"""
Tests for #244 (BB-W7-02) backup/restore.

Requires the healthdoc-postgres-1 container running with .env configured.

Run with:

    pytest tests/test_backup_restore.py -v

What this proves:
  1. backup_postgres.sh creates a valid dump.
  2. The dump passes the backup integrity check.
  3. restore_postgres.sh restores into a throwaway database.
  4. Representative table row counts match after restore.
  5. A restore event is recorded in audit_logs.
"""
import json
import os
import platform
import subprocess
import uuid
from pathlib import Path

import psycopg2
import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]

BACKUP_SCRIPT = (
    REPO_ROOT / "scripts" / "backup" / "backup_postgres.sh"
)

RESTORE_SCRIPT = (
    REPO_ROOT / "scripts" / "backup" / "restore_postgres.sh"
)


def _bash_command(script: Path, *args: str):
    """Build a Bash command that works on Windows and Unix."""
    if platform.system() == "Windows":
        bash_exe = r"C:\Program Files\Git\bin\bash.exe"

        bash_script = str(script).replace("\\", "/")

        bash_args = [
            str(arg).replace("\\", "/")
            for arg in args
        ]

        return [
            bash_exe,
            bash_script,
            *bash_args,
        ]

    return [str(script), *args]


CHECK_TABLES = [
    "patients",
    "encounters",
    "prescriptions",
]


def _env():
    env_file = REPO_ROOT.parent / ".env"
    env = {}

    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()

            if (
                not line
                or line.startswith("#")
                or "=" not in line
            ):
                continue

            k, v = line.split("=", 1)
            env[k] = v

    return {
        **os.environ,
        **env,
    }


def _connect(dbname: str):
    env = _env()

    return psycopg2.connect(
        host="localhost",
        port=env.get("POSTGRES_PORT", "5432"),
        dbname=dbname,
        user=env["POSTGRES_USER"],
        password=env.get("POSTGRES_PASSWORD", ""),
    )


def _row_counts(dbname: str) -> dict:
    counts = {}

    with _connect(dbname) as conn, conn.cursor() as cur:
        for table in CHECK_TABLES:
            cur.execute(
                f"SELECT count(*) FROM {table}"
            )
            counts[table] = cur.fetchone()[0]

    return counts


def log_restore_event(
    target_db: str,
    dump_file: str,
    source_counts: dict,
    restored_counts: dict,
):
    """Record the restore drill in audit_logs."""

    env = _env()
    match = source_counts == restored_counts

    payload = json.dumps(
        {
            "target_db": target_db,
            "dump_file": dump_file,
            "row_counts_match": match,
        }
    )

    with _connect(env["POSTGRES_DB"]) as conn, conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO audit_logs
                (
                    id,
                    facility_id,
                    action,
                    resource_type,
                    resource_id,
                    new_value,
                    reason,
                    chain_seq
                )
            SELECT
                %s,
                id,
                'restore_drill',
                'database',
                NULL,
                %s::jsonb,
                %s,
                COALESCE(
                    (
                        SELECT max(chain_seq)
                        FROM audit_logs
                        WHERE facility_id = facilities.id
                    ),
                    0
                ) + 1
            FROM facilities
            LIMIT 1
            """,
            (
                str(uuid.uuid4()),
                payload,
                (
                    "automated restore drill via "
                    "test_backup_restore.py, "
                    f"counts_match={match}"
                ),
            ),
        )

        conn.commit()


@pytest.fixture(scope="module")
def backup_file():
    result = subprocess.run(
        _bash_command(BACKUP_SCRIPT),
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=300,
    )

    assert result.returncode == 0, (
        f"backup script failed:\n"
        f"{result.stdout}\n"
        f"{result.stderr}"
    )

    dump_path = None

    for line in result.stdout.splitlines():
        line = line.strip()

        if line.startswith("Backup complete:"):
            path_text = line.split(
                "Backup complete:",
                1,
            )[1].strip()

            path_text = path_text.split(
                " (",
                1,
            )[0].strip()

            if path_text.startswith("/c/"):
                path_text = "C:/" + path_text[3:]

            dump_path = Path(path_text)
            break

    assert dump_path is not None, (
        "backup script did not report a dump path:\n"
        f"{result.stdout}"
    )

    assert dump_path.exists(), (
        f"backup script reported a dump path that "
        f"does not exist: {dump_path}\n"
        f"Full output:\n{result.stdout}"
    )

    return str(dump_path)


def test_backup_produces_valid_dump(backup_file):
    assert Path(backup_file).stat().st_size > 0


def test_restore_into_throwaway_db_matches_source(backup_file):
    target_db = (
        f"healthdoc_restore_test_"
        f"{uuid.uuid4().hex[:8]}"
    )

    source_counts = _row_counts(
        _env()["POSTGRES_DB"]
    )

    result = subprocess.run(
        _bash_command(
            RESTORE_SCRIPT,
            backup_file,
            target_db,
        ),
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=300,
    )

    assert result.returncode == 0, (
        f"restore script failed:\n"
        f"{result.stdout}\n"
        f"{result.stderr}"
    )

    restored_counts = _row_counts(target_db)

    assert restored_counts == source_counts, (
        f"row counts differ after restore: "
        f"source={source_counts} "
        f"restored={restored_counts}"
    )

    try:
        log_restore_event(
            target_db,
            backup_file,
            source_counts,
            restored_counts,
        )
    except Exception as e:
        pytest.fail(
            f"restore succeeded but audit trail "
            f"write failed: {e}"
        )

    # Cleanup throwaway database.
    conn = _connect("postgres")
    conn.autocommit = True

    try:
        with conn.cursor() as cur:
            cur.execute(
                f'DROP DATABASE IF EXISTS "{target_db}"'
            )
    finally:
        conn.close()