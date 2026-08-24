"""The consent gate must have a real catalogue purpose on every database."""
from sqlalchemy import text


async def test_clinical_review_purpose_is_seeded(engine):
    async with engine.begin() as connection:
        row = (
            await connection.execute(
                text(
                    """
                    SELECT purpose_code, requires_explicit_consent, is_active
                    FROM consent_purposes
                    WHERE purpose_code = 'clinical_review'
                    """
                )
            )
        ).mappings().one()

    assert row == {
        "purpose_code": "clinical_review",
        "requires_explicit_consent": True,
        "is_active": True,
    }
