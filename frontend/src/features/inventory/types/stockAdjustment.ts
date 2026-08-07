export type StockAdjustmentStatus =
  | "Pending Approval"
  | "First Approved"
  | "Approved"
  | "Rejected";

export interface StockAdjustment {
  id: string;

  item_id: string;
  batch_id?: string | null;

  system_quantity: number;
  adjustment_quantity: number;
  physical_quantity: number;

  reason: string;

  requested_by: string;
  requested_at: string;

  status: StockAdjustmentStatus;

  first_approved_by?: string | null;
  first_approved_at?: string | null;

  second_approved_by?: string | null;
  second_approved_at?: string | null;

  rejection_reason?: string | null;
}