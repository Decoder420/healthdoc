// export type MedicationStatus =
//   | "Scheduled"
//   | "Administered"
//   | "Missed"
//   | "Held";

// export interface MedicationRecord {
//   id: string;

//   medicationName: string;

//   dosage: string;

//   route: string;

//   scheduledTime: string;

//   administeredBy?: string;

//   status: MedicationStatus;
// }

// EMARTable.types.ts
// Strictly per HealthDoc_Database_Schema_v3_5.docx — `prescription_items` table
// (migration 0008). This table has NO per-dose schedule/administration fields —
// no scheduled_time, no administered_by, no per-dose status. Status is one value
// per prescription item, not one row per scheduled dose.
//
// Only "prescribed" (the column default) is confirmed in the doc. All other
// PrescriptionItemStatus values below are UNCONFIRMED — verify against
// backend/app/common/enums.py before relying on them.
export type MedicationStatus =
  | "prescribed"
  | "dispensed"
  | "administered"
  | "held"
  | "cancelled";

export interface MedicationRecord {
  id: string;
  prescription_id: string;
  medicine_item_id: string | null; // → inventory_items, FK added in migration 0012
  medicine_name: string; // free-text fallback / snapshot of name
  dosage: string | null;
  frequency: string | null;
  duration_days: number | null;
  route: string | null;
  instructions: string | null;
  status: MedicationStatus;
}