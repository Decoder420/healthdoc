export type MedicationStatus =
  | "Scheduled"
  | "Administered"
  | "Missed"
  | "Held";

export interface MedicationRecord {
  id: string;

  medicationName: string;

  dosage: string;

  route: string;

  scheduledTime: string;

  administeredBy?: string;

  status: MedicationStatus;
}