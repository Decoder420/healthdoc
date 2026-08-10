export interface PatientMovementRecord {
  id: string;
  admission_id: string;
  from_ward_id: string | null;
  from_bed_id: string | null;
  to_ward_id: string;
  to_bed_id: string;
  moved_at: string;
  reason: string | null;
  moved_by: string; 
}export interface WardRef {
  id: string;
  name: string;
}

export interface BedRef {
  id: string;
  bed_number: string;
}
export interface PatientMovementProps {
  admissionId: string | null;
  records: PatientMovementRecord[];
  wards?: WardRef[];
  beds?: BedRef[];
}