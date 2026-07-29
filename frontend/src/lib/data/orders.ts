import { Order } from "@/features/nurse/components/TaskQueue";

// Mock data for TaskQueue — shaped per `orders` table (schema doc, migration 0009).
// `patient_name` is included here only because a real bed/order-list endpoint would
// need to join it in; it is NOT a column on `orders` itself (see TaskQueue.types.ts).
export const orders: Order[] = [
  {
    id: "1",
    order_number: "ORD-1001",
    encounter_id: "enc-1",
    patient_id: "p1",
    patient_name: "Rahul Kumar",
    order_type: "lab",
    priority: "stat",
    status: "pending",
    ordered_at: "2026-07-24T08:15:00Z",
  },
  {
    id: "2",
    order_number: "ORD-1002",
    encounter_id: "enc-1",
    patient_id: "p1",
    patient_name: "Rahul Kumar",
    order_type: "pharmacy",
    priority: "urgent",
    status: "pending",
    ordered_at: "2026-07-24T09:00:00Z",
  },
  {
    id: "3",
    order_number: "ORD-1003",
    encounter_id: "enc-2",
    patient_id: "p2",
    patient_name: "Amit Singh",
    order_type: "radiology",
    priority: "routine",
    status: "pending",
    ordered_at: "2026-07-24T09:30:00Z",
  },
  {
    id: "4",
    order_number: "ORD-1004",
    encounter_id: "enc-3",
    patient_id: "p3",
    patient_name: "Sneha Patel",
    order_type: "blood",
    priority: "stat",
    status: "pending",
    ordered_at: "2026-07-24T10:05:00Z",
  },
  {
    id: "5",
    order_number: "ORD-1005",
    encounter_id: "enc-2",
    patient_id: "p2",
    patient_name: "Amit Singh",
    order_type: "procedure",
    priority: "urgent",
    status: "completed",
    ordered_at: "2026-07-24T07:00:00Z",
    completed_at: "2026-07-24T07:45:00Z",
  },
];