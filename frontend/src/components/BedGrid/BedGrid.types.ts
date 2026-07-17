export type BedStatus = "occupied" | "vacant" | "reserved" | "cleaning";

export type Bed = {
  id: string;
  label: string;
  ward: string;
  status: BedStatus;
  patientName?: string;
};
