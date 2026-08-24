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

DISPLAY_NAMES = {
    "dev.receptionist": "Dev Receptionist",
    "dev.doctor": "Dev Doctor",
    "dev.nurse": "Dev Nurse",
    "dev.labtech": "Dev Lab Technician",
    "dev.radiology": "Dev Radiology Technician",
    "dev.pharmacist": "Dev Pharmacist",
    "dev.admin": "Dev Admin",
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
                    },
                )
                continue

            await session.execute(
                text(
                    """
                    INSERT INTO users
                        (id, keycloak_sub, username, full_name, email, facility_id, is_active)
                    VALUES
                        (:id, :subject, :username, :full_name, :email, :facility_id, true)
                    ON CONFLICT (keycloak_sub) DO UPDATE SET
                        username = EXCLUDED.username,
                        full_name = EXCLUDED.full_name,
                        email = EXCLUDED.email,
                        facility_id = EXCLUDED.facility_id,
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
