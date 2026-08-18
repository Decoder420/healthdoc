export type OrderType = "lab" | "radiology" | "pharmacy" | "procedure" | "blood";
export type OrderPriority = "routine" | "urgent" | "stat";

export type OrderStatus =
  | "placed"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  encounter_id: string;
  patient_id: string;
  order_type: OrderType;
  priority: OrderPriority;
  status: OrderStatus;
  ordered_at: string;

  // Joined display field — not a column on `orders` (comes from
  // patients.full_name).
  patient_name?: string | null;

  // NOT a confirmed column on `orders`. The table is [Blame]-tagged, so a
  // generic `updated_at` exists and would naturally reflect the last status
  // change — but there's no dedicated `completed_at` field in the schema
  // doc. This is local/UI-only for now (see handleCheckOff in
  // ward-dashboard/page.tsx, which never calls a backend endpoint).
  // Confirm with backend whether `updated_at` should be used instead, or a
  // real `completed_at` column will be added.
  completed_at?: string | null;
}
export interface TaskQueueProps {
  orders: Order[];
  onCheckOff: (orderId: string) => void;
}