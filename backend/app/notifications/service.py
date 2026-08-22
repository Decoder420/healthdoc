"""Notification event preparation for staff-facing SSE alerts.

    pending_event = await prepare_lab_report_ready_event(db, ...)
    await db.commit()
    background_tasks.add_task(
        publish_event, pending_event["channel"], pending_event["event_type"], pending_event["payload"]
    )
"""
import uuid

from fastapi import HTTPException 
from sqlalchemy.ext.asyncio import AsyncSession
 
from app.common.redis import department_channel, facility_channel
from app.notifications.models import NotificationHistory, NotificationPreference
from sqlalchemy import desc, select, func
 
 
async def prepare_lab_report_ready_event(
    db: AsyncSession,
    facility_id: uuid.UUID,
    department_id: uuid.UUID,
    lab_order_item_id: uuid.UUID,
    accession_number: str,
    doctor_user_id: uuid.UUID,
    test_name: str,
) -> dict:
    payload = {
        "department_id": str(department_id),
        "lab_order_item_id": str(lab_order_item_id),
        "accession_number": accession_number,
        "doctor_user_id": str(doctor_user_id),
        "test_name": test_name,
    }
    db.add(NotificationHistory(
        id=uuid.uuid4(),
        event_type="lab_report_ready",
        payload=payload,
        department_id=department_id,
        facility_id=facility_id,
    ))
    await db.flush()
    return {
        "channel": department_channel(department_id),
        "event_type": "lab_report_ready",
        "payload": payload,
    }
 
 
async def prepare_critical_value_alert_event(
    db: AsyncSession,
    facility_id: uuid.UUID,
    department_id: uuid.UUID,
    lab_order_item_id: uuid.UUID,
    accession_number: str,
    doctor_user_id: uuid.UUID,
    test_name: str,
    value: str,
    severity: str,
) -> dict:
    payload = {
        "department_id": str(department_id),
        "lab_order_item_id": str(lab_order_item_id),
        "accession_number": accession_number,
        "doctor_user_id": str(doctor_user_id),
        "test_name": test_name,
        "value": value,
        "severity": severity,
    }
    db.add(NotificationHistory(
        id=uuid.uuid4(),
        event_type="critical_value_alert",
        payload=payload,
        department_id=department_id,
        facility_id=facility_id,
    ))
    await db.flush()
    return {
        "channel": department_channel(department_id),
        "event_type": "critical_value_alert",
        "payload": payload,
    }
 
 
async def prepare_low_stock_alert_event(
    db: AsyncSession,
    facility_id: uuid.UUID,
    item_id: uuid.UUID,
    item_name: str,
    current_quantity: str,
    reorder_level: str,
    department_id: uuid.UUID | None = None,
) -> dict:
    payload = {
        "item_id": str(item_id),
        "item_name": item_name,
        "current_quantity": current_quantity,
        "reorder_level": reorder_level,
    }
    db.add(NotificationHistory(
        id=uuid.uuid4(),
        event_type="low_stock_alert",
        payload=payload,
        department_id=department_id,
        facility_id=facility_id,
    ))
    await db.flush()
 
    channel = department_channel(department_id) if department_id else facility_channel(facility_id)
    return {
        "channel": channel,
        "event_type": "low_stock_alert",
        "payload": payload,
    }


_MAX_PAGE_SIZE = 100
_SORTABLE_FIELDS = {"created_at": NotificationHistory.created_at}
 
 
# ---------------- NOTIFICATION HISTORY: LIST (hod/admin only) ----------------
async def list_notification_history(
    db: AsyncSession,
    caller_facility_id: uuid.UUID,
    department_id: uuid.UUID | None,
    event_type: str | None,
    page: int,
    page_size: int,
    sort: str,
    for_role: str | None = None,
) -> dict:
    """History for one facility.

    `for_role` applies that role's per-role preferences (#230): anything the
    role has silenced is excluded from both the page and the total, so the
    count matches what the caller can actually see. Omit it to read the
    unfiltered history — an admin auditing what was published needs the real
    list, not their own filtered view.
    """
    if page_size > _MAX_PAGE_SIZE:
        raise HTTPException(422, f"page_size cannot exceed {_MAX_PAGE_SIZE}")
 
    descending = sort.startswith("-")
    field_name = sort[1:] if descending else sort
    if field_name not in _SORTABLE_FIELDS:
        raise HTTPException(422, f"Cannot sort by '{field_name}' -- allowed: {sorted(_SORTABLE_FIELDS)}")
    sort_column = _SORTABLE_FIELDS[field_name]
    sort_column = desc(sort_column) if descending else sort_column
 
    query = select(NotificationHistory).where(NotificationHistory.facility_id == caller_facility_id)
    count_query = select(func.count(NotificationHistory.id)).where(
        NotificationHistory.facility_id == caller_facility_id
    )
 
    if department_id is not None:
        query = query.where(NotificationHistory.department_id == department_id)
        count_query = count_query.where(NotificationHistory.department_id == department_id)
 
    if event_type is not None:
        query = query.where(NotificationHistory.event_type == event_type)
        count_query = count_query.where(NotificationHistory.event_type == event_type)

    if for_role is not None:
        # One query for the whole set rather than a lookup per row.
        silenced = await silenced_event_types(
            db, facility_id=caller_facility_id, role=for_role)
        if silenced:
            query = query.where(NotificationHistory.event_type.notin_(silenced))
            count_query = count_query.where(NotificationHistory.event_type.notin_(silenced))
 
    total = (await db.execute(count_query)).scalar_one()
 
    query = query.order_by(sort_column).offset((page - 1) * page_size).limit(page_size)
    items = (await db.execute(query)).scalars().all()
 
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total,
    }
 

# --------------------- Per-role preferences ---------------------

async def is_enabled(
    db: AsyncSession, *, facility_id: uuid.UUID, role: str, event_type: str
) -> bool:
    """Is this event_type delivered to this role at this facility?

    True unless a row explicitly says otherwise. Opt-out, not opt-in — a new
    event_type must not be silently invisible to everyone until someone
    remembers to switch it on. A missed low_stock_alert is an annoyance; a
    missed lab_critical_result is a patient safety event.
    """
    result = await db.execute(
        select(NotificationPreference.enabled).where(
            NotificationPreference.facility_id == facility_id,
            NotificationPreference.role == role,
            NotificationPreference.event_type == event_type,
        )
    )
    row = result.scalar_one_or_none()
    return True if row is None else bool(row)


# ---------------- NEW FOR #400: publish-path preference gate ----------------
async def is_enabled_for_any_roles(
    db: AsyncSession, *, facility_id: uuid.UUID, roles: list[str], event_type: str
) -> bool:
    """Is this event_type delivered to a caller holding these roles?
 
    A caller can hold more than one role (Keycloak realm roles, not a single
    column here). Suppress only if *every* role they hold has silenced this
    event_type -- showing it is the safe default, matching is_enabled's
    opt-out philosophy: a missed lab_critical_result is worse than one shown
    to someone who, in one of their other roles, still wants to see it.
 
    One query per role rather than a single IN-query, since roles is small
    (realm role lists are a handful of entries, not hundreds) and this keeps
    the same is_enabled() as the single source of truth for the check.
    """
    for role in roles:
        if await is_enabled(db, facility_id=facility_id, role=role, event_type=event_type):
            return True
    return False


async def silenced_event_types(
    db: AsyncSession, *, facility_id: uuid.UUID, role: str
) -> set[str]:
    """Everything this role has turned off here.

    One query, so a list endpoint can filter a page of history without going
    back to the database per row.
    """
    result = await db.execute(
        select(NotificationPreference.event_type).where(
            NotificationPreference.facility_id == facility_id,
            NotificationPreference.role == role,
            NotificationPreference.enabled.is_(False),
        )
    )
    return set(result.scalars().all())


async def list_preferences(
    db: AsyncSession, *, facility_id: uuid.UUID, role: str | None = None
) -> list[NotificationPreference]:
    stmt = select(NotificationPreference).where(
        NotificationPreference.facility_id == facility_id)
    if role is not None:
        stmt = stmt.where(NotificationPreference.role == role)
    result = await db.execute(
        stmt.order_by(NotificationPreference.role, NotificationPreference.event_type))
    return list(result.scalars().all())


async def set_preference(
    db: AsyncSession,
    *,
    facility_id: uuid.UUID,
    role: str,
    event_type: str,
    enabled: bool,
    actor_id: uuid.UUID,
) -> NotificationPreference:
    """Upsert one (facility, role, event_type) decision.

    Re-enabling UPDATEs the row rather than deleting it, so the record of the
    earlier decision — and who made it — survives.
    """
    existing = await db.execute(
        select(NotificationPreference).where(
            NotificationPreference.facility_id == facility_id,
            NotificationPreference.role == role,
            NotificationPreference.event_type == event_type,
        )
    )
    pref = existing.scalar_one_or_none()

    if pref is None:
        pref = NotificationPreference(
            id=uuid.uuid4(),
            facility_id=facility_id,
            role=role,
            event_type=event_type,
            enabled=enabled,
            created_by=actor_id,
        )
        db.add(pref)
    else:
        pref.enabled = enabled
        pref.updated_by = actor_id

    await db.flush()
    await db.refresh(pref)
    return pref
