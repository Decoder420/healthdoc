export type OrderType = "lab" | "radiology" | "pharmacy" | "procedure" | "blood" | string;
export type OrderPriority = "routine" | "urgent" | "stat";

export type OrderStatus =
  | "placed"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  order_number?: string;
  encounter_id: string | null;
  patient_id: string;
  order_type: OrderType;
  priority: OrderPriority;
  status: OrderStatus;
  ordered_at: string;

  // Joined display field — not a column on `orders` (comes from
  // patients.full_name).
  patient_name?: string | null;
}
export interface TaskQueueProps {
  orders: Order[];
  onCheckOff: (orderId: string) => void | Promise<void>;
}
