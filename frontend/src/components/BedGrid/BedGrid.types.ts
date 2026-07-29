// beds: ward_id, bed_number, status. Nothing else exists on this table in the document.
 // Only "vacant" is confirmed in the document (column default). "occupied" and
// "reserved" are NOT in the schema doc — confirm against backend/app/common/enums.py
// (BedStatus) before relying on them.
export type BedStatus = "vacant" | "occupied" | "reserved";
 
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