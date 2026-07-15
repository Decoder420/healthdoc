import { MedicationStatus } from "./EMARTable.types";

export const MEDICATION_STATUS_STYLES: Record<
  MedicationStatus,
  string
> = {
  Scheduled:
    "bg-info-muted text-info",

  Administered:
    "bg-success-muted text-success",

  Missed:
    "bg-danger-muted text-danger",

  Held:
    "bg-warning-muted text-warning",
};