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
  created_by?: string;
  created_at?: string;
}

export interface IntakeOutputProps {
  admissionId: string | null;
  records: IntakeOutputRecord[];
}