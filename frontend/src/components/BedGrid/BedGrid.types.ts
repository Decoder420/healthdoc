export type BedStatus = "vacant" | "occupied" | "reserved" | "maintenance";

export interface Bed {
  id: string;
  ward_id: string;
  bed_number: string;
  status: BedStatus;
}

export interface BedGridProps {
  beds: Bed[];
  selectedBedId?: string;
  onBedClick?: (bed: Bed) => void;
}