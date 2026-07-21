// export type BedStatus =
//   | "Occupied"
//   | "Vacant"
//   | "Reserved"
//   | "Cleaning";

// export interface Bed {
//   id: string;
//   bedNumber: string;
//   patientName?: string;
//   status: BedStatus;
//   wardName?: string;
// }


export type BedStatus =
  | "Occupied"
  | "Vacant"
  | "Reserved"
  | "Cleaning";

export interface Bed {
  id: string;
  bedNumber: string;
  patientName?: string;
  status: BedStatus;
  wardName?: string;
}

export interface BedGridProps {
  beds: Bed[];
  selectedBedId?: string;
  onBedClick?: (bed: Bed) => void;
}