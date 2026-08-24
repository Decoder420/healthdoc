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


# ---------------------------------------------------------------- 0028 maker-checker

class AccountRequestCreate(BaseModel):
    """Ask for a staff account. Creates nothing until an approver acts."""

    requested_for_full_name: str = Field(min_length=1)
    requested_username: str = Field(min_length=3, max_length=100)
    requested_roles: list[str] = Field(min_length=1, description="Keycloak realm roles")
    designation: str | None = None
    employee_id: str | None = None
    registration_number: str | None = None
    qualification: str | None = None
    email: EmailStr | None = None
    mobile: str | None = Field(default=None, pattern=r"^\+91\d{10}$")
    justification: str = Field(
        min_length=10,
        description="Why this account is needed. Required, and required to say "
                    "something — an approver cannot exercise judgement on a blank.",
    )
    #: No facility_id. The request is raised at the requester's own facility,
    #: from the token — same rule as UserCreate.


class AccountRequestApprove(BaseModel):
    temporary_password: str = Field(min_length=8)


class AccountRequestReject(BaseModel):
    reason: str = Field(
        min_length=1,
        description="Recorded on the request. A refusal with no reason is not "
                    "reviewable afterwards.",
    )


class AccountRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    facility_id: uuid.UUID
    requested_for_full_name: str
    requested_username: str
    requested_roles: list[str]
    designation: str | None
    employee_id: str | None
    registration_number: str | None
    qualification: str | None
    email: str | None
    mobile: str | None
    justification: str
    requested_by: uuid.UUID
    status: str
    decided_by: uuid.UUID | None
    decided_at: datetime | None
    rejection_reason: str | None
    #: Set on approval — the users.id that was created. Null otherwise.
    created_user_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class AccountRequestListOut(BaseModel):
    items: list[AccountRequestOut]
    page: int
    page_size: int
