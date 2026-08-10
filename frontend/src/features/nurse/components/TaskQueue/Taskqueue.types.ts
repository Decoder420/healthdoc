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

  patient_name?: string | null; 
  completed_at?: string | null; 
}
export interface TaskQueueProps {
  orders: Order[];
  onCheckOff: (orderId: string) => void;
}