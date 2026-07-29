// IntakeOutput.types.ts
// Per HealthDoc_Database_Schema_v3_5.docx — `intake_output_records` (migration 0023, [Blame]).
// Confirmed columns: admission_id, recorded_at, entry_type, volume_ml, notes.
// `created_by`/`created_at` come from the [Blame] audit mixin — captured
// automatically by the backend, not submitted by the form. `recordedBy` (a
// free-text field) has been removed per TL feedback.

export type EntryType =
  | "intake_oral"
  | "intake_iv"
  | "output_urine"
  | "output_drain"
  | "output_other";

export interface IntakeOutputRecord {
  id: string;
  admission_id: string;
  recorded_at: string;
  entry_type: EntryType;
  volume_ml: number;
  notes: string | null;

  created_by?: string; // audit mixin — who recorded this, captured automatically
  created_at?: string;
}

export interface IntakeOutputProps {
  admissionId: string | null;
  records: IntakeOutputRecord[];
}