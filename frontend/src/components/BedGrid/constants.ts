import { BedStatus } from "./BedGrid.types";

export const BED_STATUS_STYLES: Record<
  BedStatus,
  string
> = {
  Occupied:
    "bg-danger-muted text-danger",

  Vacant:
    "bg-success-muted text-success",

  Reserved:
    "bg-info-muted text-info",

  Cleaning:
    "bg-warning-muted text-warning",
};