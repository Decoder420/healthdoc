
// Strictly per HealthDoc_Database_Schema_v3_5.docx — `patient_movement_log`
// (migration 0023), append-only. Confirmed columns: admission_id, from_ward_id,
// from_bed_id, to_ward_id, to_bed_id, moved_at, reason, moved_by.
// No [Blame] mixin on this table — moved_by is a real required column, not an
// automatically-captured audit field.

export interface PatientMovementRecord {
  id: string;
  admission_id: string;
  from_ward_id: string | null;
  from_bed_id: string | null;
  to_ward_id: string;
  to_bed_id: string;
  moved_at: string;
  reason: string | null;
  moved_by: string; // users.id (UUID) of the nurse who performed the move
}

// Ward/bed names are NOT columns on patient_movement_log (only IDs are stored).
// These reference-lookup types are for display purposes only — resolving an
// id to a human-readable name — and are passed as separate props rather than
// invented onto PatientMovementRecord itself.
export interface WardRef {
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