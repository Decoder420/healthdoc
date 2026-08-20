import { MedicationStatus } from "./EMARTable.types";

export const MEDICATION_STATUS_STYLES: Record<MedicationStatus, string> = {
  given: "bg-success-muted text-success",
  // Held and refused are both "not given", and both carry a reason — but they
  // are not the same event and are not styled as one. Held is a staff
  // decision; refused is the patient's.
  held: "bg-warning-muted text-warning",
  refused: "bg-danger-muted text-danger",
};
