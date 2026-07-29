// TaskQueue.types.ts
// Strictly per HealthDoc_Database_Schema_v3_5.docx — `orders` table (migration 0009).
// Confirmed columns: order_number, encounter_id, patient_id, order_type, priority,
// status, ordered_at. No patient_name column exists on `orders` — that would need a
// joined endpoint (same gap flagged earlier for beds -> patient).

export type OrderType = "lab" | "radiology" | "pharmacy" | "procedure" | "blood";

export type OrderPriority = "routine" | "urgent" | "stat";

// Only "prescribed"-style default pattern seen elsewhere in the doc for other
// status columns — the exact OrderStatus enum values are NOT given in the schema
// doc's `orders` section. "pending" and "completed" below are assumed for the
// queue/check-off UI — CONFIRM against backend/app/common/enums.py before relying
// on them.
export type OrderStatus = "pending" | "completed";

export interface Order {
  id: string;
  order_number: string;
  encounter_id: string;
  patient_id: string;
  order_type: OrderType;
  priority: OrderPriority;
  status: OrderStatus;
  ordered_at: string;

  // NOT a column on `orders` — would require a joined endpoint. Kept optional
  // and nullable so the UI degrades gracefully until backend confirms this.
  patient_name?: string | null;

  // "check-off with timestamp" (W4 requirement) — NOT a documented column.
  // The doc only lists a `POST /orders` endpoint; no PATCH/status-update
  // endpoint or a completed_at column is documented. This field is a frontend
  // assumption until backend confirms the real contract.
  completed_at?: string | null;
}

export interface TaskQueueProps {
  orders: Order[];
  onCheckOff: (orderId: string) => void;
}