"""Notification event preparation for staff-facing SSE alerts.

    pending_event = await prepare_lab_report_ready_event(db, ...)
    await db.commit()
    background_tasks.add_task(
        publish_event, pending_event["channel"], pending_event["event_type"], pending_event["payload"]
    )
"""
import uuid
 
from sqlalchemy.ext.asyncio import AsyncSession
 
from app.common.redis import department_channel, facility_channel
from app.notifications.models import NotificationHistory
 
 
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
