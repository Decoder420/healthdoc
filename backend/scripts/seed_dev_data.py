"""Idempotent local-development identities required by authenticated smoke tests.

Keycloak owns credentials and roles. This script creates only the matching
application-side ``facilities`` and ``users`` rows after dev_setup has read the
real Keycloak subjects. It is never run by migrations or production startup.
"""
from __future__ import annotations

import argparse
import asyncio
import uuid

from sqlalchemy import text

from app.common.db import SessionLocal

FACILITY_ID = uuid.UUID("00000000-0000-0000-0000-000000000101")

#: A department, so the HOD dashboard has something to scope to.
#:
#: /users/me returns the caller's department and the HOD screen is per-department;
#: a seeded HOD with department_id NULL lands on "your account is not attached to
#: a department" and the dashboard cannot be exercised at all — which is exactly
#: where it stood until this seed existed.
DEPARTMENT_ID = uuid.UUID("00000000-0000-0000-0000-000000000102")

#: Users given DEPARTMENT_ID. Clinical roles belong to a department; admin and
#: auditor deliberately do not, which is why /users/me's join is OUTER.
DEPARTMENTAL_USERS = {"dev.hod", "dev.doctor", "dev.nurse"}

DISPLAY_NAMES = {
    "dev.receptionist": "Dev Receptionist",
    "dev.doctor": "Dev Doctor",
    "dev.nurse": "Dev Nurse",
    "dev.labtech": "Dev Lab Technician",
    "dev.radiology": "Dev Radiology Technician",
    "dev.pharmacist": "Dev Pharmacist",
    "dev.admin": "Dev Admin",
    "dev.patient": "Dev Patient",
    "dev.hod": "Dev Head of Department",
}


def parse_user(value: str) -> tuple[str, str]:
    username, separator, subject = value.partition("=")
    if not separator or not username or not subject:
        raise argparse.ArgumentTypeError("expected USERNAME=KEYCLOAK_SUB")
    return username, subject


async def seed(users: list[tuple[str, str]]) -> None:
    async with SessionLocal() as session, session.begin():
        await session.execute(
            text(
                """
                INSERT INTO facilities
                    (id, code, name, state_code, timezone, facility_type, is_active)
                VALUES
                    (:id, 'DEV001', 'HealthDoc Development Hospital', 'DL',
                     'Asia/Kolkata', 'hospital', true)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    timezone = EXCLUDED.timezone,
                    is_active = true
                """
            ),
            {"id": FACILITY_ID},
        )

        await session.execute(
            text(
                """
                INSERT INTO departments (id, name, code, facility_id)
                VALUES (:id, 'General Medicine', 'GENMED', :facility_id)
                ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
                """
            ),
            {"id": DEPARTMENT_ID, "facility_id": FACILITY_ID},
        )

        for username, subject in users:
            existing = (
                await session.execute(
                    text("SELECT id FROM users WHERE username = :username"),
                    {"username": username},
                )
            ).scalar_one_or_none()
            if existing:
                await session.execute(
                    text(
                        """
                        UPDATE users
                           SET keycloak_sub = :subject,
                               full_name = :full_name,
                               email = :email,
                               facility_id = :facility_id,
                               department_id = :department_id,
                               is_active = true,
                               updated_at = now()
                         WHERE id = :id
                        """
                    ),
                    {
                        "id": existing,
                        "subject": subject,
                        "full_name": DISPLAY_NAMES.get(username, username),
                        "email": f"{username}@healthdoc.local",
                        "facility_id": FACILITY_ID,
                        "department_id": (
                            DEPARTMENT_ID if username in DEPARTMENTAL_USERS else None
                        ),
                    },
                )
                continue

            await session.execute(
                text(
                    """
                    INSERT INTO users
                        (id, keycloak_sub, username, full_name, email, facility_id,
                         department_id, is_active)
                    VALUES
                        (:id, :subject, :username, :full_name, :email, :facility_id,
                         :department_id, true)
                    ON CONFLICT (keycloak_sub) DO UPDATE SET
                        username = EXCLUDED.username,
                        full_name = EXCLUDED.full_name,
                        email = EXCLUDED.email,
                        facility_id = EXCLUDED.facility_id,
                        department_id = EXCLUDED.department_id,
                        is_active = true,
                        updated_at = now()
                    """
                ),
                {
                    "id": uuid.uuid5(uuid.NAMESPACE_URL, f"healthdoc:{username}"),
                    "subject": subject,
                    "username": username,
                    "full_name": DISPLAY_NAMES.get(username, username),
                    "email": f"{username}@healthdoc.local",
                    "facility_id": FACILITY_ID,
                },
            )

        patient_user_id = (
            await session.execute(
                text("SELECT id FROM users WHERE username = 'dev.patient'")
            )
        ).scalar_one_or_none()
        verifier_id = (
            await session.execute(
                text("SELECT id FROM users WHERE username = 'dev.admin'")
            )
        ).scalar_one_or_none()
        if patient_user_id is not None and verifier_id is not None:
            patient_id = uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:dev.patient:patient")
            await session.execute(
                text(
                    """
                    INSERT INTO patients
                        (id, thid, full_name, sex, dob, abha_number, identity_path,
                         identity_status, status, facility_id, created_by)
                    VALUES
                        (:id, 'TH-DEV001-PORTAL', 'Dev Patient', 'unknown', DATE '1990-01-01',
                         '91123456789012', 'abdm', 'verified', 'active', :facility_id, :verifier_id)
                    ON CONFLICT (id) DO UPDATE SET
                        abha_number = EXCLUDED.abha_number,
                        identity_status = 'verified', status = 'active', deleted_at = NULL,
                        updated_at = now(), updated_by = :verifier_id
                    """
                ),
                {
                    "id": patient_id,
                    "facility_id": FACILITY_ID,
                    "verifier_id": verifier_id,
                },
            )
            await session.execute(
                text(
                    """
                    INSERT INTO patient_portal_bindings
                        (id, user_id, patient_id, facility_id, verification_method,
                         verification_reference, verified_by)
                    VALUES
                        (:id, :user_id, :patient_id, :facility_id, 'abha_otp',
                         'DEV-ABHA-OTP-TXN', :verifier_id)
                    ON CONFLICT (id) DO UPDATE SET
                        patient_id = EXCLUDED.patient_id,
                        verification_method = EXCLUDED.verification_method,
                        verification_reference = EXCLUDED.verification_reference,
                        verified_by = EXCLUDED.verified_by,
                        verified_at = now(), revoked_at = NULL, revoked_by = NULL,
                        revocation_reason = NULL, updated_at = now()
                    """
                ),
                {
                    "id": uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:dev.patient:binding"),
                    "user_id": patient_user_id,
                    "patient_id": patient_id,
                    "facility_id": FACILITY_ID,
                    "verifier_id": verifier_id,
                },
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--user",
        action="append",
        type=parse_user,
        required=True,
        help="Application username and Keycloak subject: USERNAME=SUB",
    )
    args = parser.parse_args()
    asyncio.run(seed(args.user))
    print(f"Seeded development facility and {len(args.user)} authenticated users")


if __name__ == "__main__":
    main()
