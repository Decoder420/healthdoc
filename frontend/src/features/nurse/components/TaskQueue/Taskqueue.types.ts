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
}

export interface TaskQueueProps {
  orders: Order[];
  onCheckOff: (orderId: string) => void;
  onAccept: (orderId: string) => void;
}