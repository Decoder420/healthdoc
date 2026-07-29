import { MedicationStatus } from "./EMARTable.types";

export const MEDICATION_STATUS_STYLES: Record<MedicationStatus, string> = {
  prescribed: "bg-info-muted text-info",
  dispensed: "bg-warning-muted text-warning",
  administered: "bg-success-muted text-success",
  held: "bg-warning-muted text-warning",
  cancelled: "bg-danger-muted text-danger",
};