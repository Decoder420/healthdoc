"""0048 seed the canonical clinical-review consent purpose

Revision ID: 0048
Revises: 0047
Create Date: 2026-08-24

Patient history is consent-gated against purpose_code='clinical_review'. The
catalogue table was created in 0004 but no migration seeded this purpose, so a
fresh database had no purpose_id that reception or clinical staff could use to
record the consent needed to unlock the read.

This is reference data, not demo data. A stable UUID makes the insert
idempotent across restored environments; an existing purpose with the same
code is preserved.
"""
from alembic import op

revision = "0048"
down_revision = "0047"
branch_labels = None
depends_on = None

_PURPOSE_ID = "bf537623-0db4-44bd-9b3b-525b4f43997f"
_PURPOSE_CODE = "clinical_review"


def upgrade() -> None:
    op.execute(
        f"""
        INSERT INTO consent_purposes
            (id, purpose_code, description, default_expiry_days,
             requires_explicit_consent, is_active)
        VALUES
            ('{_PURPOSE_ID}'::uuid, '{_PURPOSE_CODE}',
             'Read clinical history for direct treatment', NULL, true, true)
        ON CONFLICT (purpose_code) DO NOTHING
        """
    )


def downgrade() -> None:
    # Do not destroy a purpose that already has legal consent artefacts. A
    # downgrade may remove the code path, but it must not erase the evidence.
    op.execute(
        f"""
        DELETE FROM consent_purposes p
        WHERE p.id = '{_PURPOSE_ID}'::uuid
          AND NOT EXISTS (
              SELECT 1 FROM consent_records r WHERE r.purpose_id = p.id
          )
        """
    )
