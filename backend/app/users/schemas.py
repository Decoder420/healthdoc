import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    full_name: str
    email: EmailStr | None = None
    mobile: str | None = Field(default=None, pattern=r"^\+91\d{10}$")
    designation: str | None = None
    employee_id: str | None = None
    registration_number: str | None = None
    qualification: str | None = None
    #: Ignored — the account is created at the authenticated admin's facility.
    #: Optional rather than removed so existing callers keep validating; the
    #: router refuses a value that disagrees with the caller's own facility.
    facility_id: uuid.UUID | None = None
    roles: list[str] = Field(default_factory=list, description="Keycloak realm roles")
    temporary_password: str = Field(min_length=8)


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    mobile: str | None = Field(default=None, pattern=r"^\+91\d{10}$")
    designation: str | None = None
    employee_id: str | None = None
    registration_number: str | None = None
    qualification: str | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    keycloak_sub: str
    username: str
    full_name: str
    email: str | None
    mobile: str | None
    designation: str | None
    employee_id: str | None
    registration_number: str | None
    qualification: str | None
    facility_id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
