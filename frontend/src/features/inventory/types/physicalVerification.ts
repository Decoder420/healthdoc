export type PhysicalVerificationStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export type PhysicalVerificationResult =
  | "Matched"
  | "Variance Found";

export interface PhysicalVerificationItem {
  id: string;

  item_id: string;
  item_name: string;

  batch_id?: string | null;

  system_quantity: number;
  physical_quantity?: number | null;

  variance?: number | null;

  result?: PhysicalVerificationResult | null;

  status: PhysicalVerificationStatus;

  verified_by?: string | null;
  verified_at?: string | null;

  remarks?: string | null;

  created_at: string;
}