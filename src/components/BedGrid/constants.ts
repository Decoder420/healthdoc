import type { BedStatus } from "./BedGrid.types";

export const BED_STATUS_LABELS: Record<BedStatus, string> = {
  occupied: "Occupied",
  vacant: "Vacant",
  reserved: "Reserved",
  cleaning: "Cleaning",
};

export const BED_STATUS_CLASSES: Record<BedStatus, string> = {
  occupied: "border-primary/40 bg-primary/5",
  vacant: "border-success/40 bg-success-muted",
  reserved: "border-warning/40 bg-warning-muted",
  cleaning: "border-muted-foreground/30 bg-muted",
};
