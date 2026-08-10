import { MedicationStatus } from "./EMARTable.types";

export const MEDICATION_STATUS_STYLES: Record<MedicationStatus, string> = {
  prescribed: "bg-info-muted text-info",
  partially_dispensed: "bg-warning-muted text-warning",
  dispensed: "bg-success-muted text-success",
  substituted: "bg-warning-muted text-warning",
  cancelled: "bg-danger-muted text-danger",
};