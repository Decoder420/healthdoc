"""
Pydantic schemas for the files module.

Repo path: backend/app/files/schemas.py

B7-W6-01: MinIO file APIs. FileOut deliberately excludes bucket/object_key
-- schema doc §7: "never in any response: ... internal file object keys
(serve files via presigned URL endpoints)". A presigned URL is the only
sanctioned way a client ever reaches the actual bytes.
"""
from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class FileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    original_name: str | None
    content_type: str | None
    size_bytes: int | None
    #: Null on an erased row — the digest is cleared with the bytes.
    sha256: str | None
    owner_module: str | None
    facility_id: uuid.UUID
    patient_id: uuid.UUID | None
    uploaded_by: uuid.UUID
    sensitivity: str
    scan_status: str
    created_at: datetime
    updated_at: datetime

    # --- erasure tombstone (#368) ---
    # Returned rather than hidden. A caller entitled to the file is entitled to
    # know it was destroyed, when, and on what basis; a bare 404 would leave the
    # access log unreconcilable against what users were actually told.
    erased_at: datetime | None = None
    erasure_reason: str | None = None


class FileEraseRequest(BaseModel):
    #: Free text, required. The CHECK constraint refuses an erased row without
    #: one, because "why" is the only part of an erasure a regulator asks about.
    reason: str = Field(min_length=1, max_length=2000)

    @field_validator("reason")
    @classmethod
    def reason_must_not_be_blank(cls, value: str) -> str:
        """Reject whitespace-only justifications and store the normalized text."""
        reason = value.strip()
        if not reason:
            raise ValueError("Erasure reason must not be blank")
        return reason


class FileDownloadUrlOut(BaseModel):
    url: str
    expires_in_seconds: int
