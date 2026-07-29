export type Shift = "morning" | "evening" | "night";

export interface HandoverNote {
  id: string;
  admission_id: string;
  shift: Shift;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  handed_over_to: string; // users.id (UUID) of the nurse taking over

  // Captured automatically by the backend, not sent by the form. Included here
  // only for display (e.g. "handed over by <created_by> at <created_at>").
  created_by?: string;
  created_at?: string;
}

export interface HandoverNotesProps {
  admissionId: string | null;
  notes: HandoverNote[];
}