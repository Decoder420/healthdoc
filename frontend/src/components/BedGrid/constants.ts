import { BedStatus } from "./BedGrid.types";
 
export const BED_STATUS_STYLES: Record<BedStatus, string> = {
  vacant: "bg-success-muted text-success",
  occupied: "bg-danger-muted text-danger",
  reserved: "bg-info-muted text-info",
};