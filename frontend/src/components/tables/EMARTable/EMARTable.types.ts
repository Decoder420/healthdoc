export type MedicationStatus =
  | "prescribed"
  | "partially_dispensed"
  | "dispensed"
  | "substituted"
  | "cancelled";

export interface MedicationRecord {
  id: string;
  prescription_id: string;
  medicine_item_id: string | null;
  medicine_name: string;
  dosage: string | null;
  frequency: string | null;
  duration_days: number | null;
  route: string | null;
  instructions: string | null;
  status: MedicationStatus;
}