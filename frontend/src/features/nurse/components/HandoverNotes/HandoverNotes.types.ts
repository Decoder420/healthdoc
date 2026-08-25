export type Shift = "morning" | "evening" | "night";

export interface HandoverNote {
  id: string;
  admission_id: string;
  shift: Shift;
  situation: string | null;
  background: string | null;
  assessment: string | null;
  recommendation: string | null;
  handed_over_to: string;
  created_by?: string;
  created_at?: string;
}

export interface HandoverNotesProps {
  admissionId: string | null;
  notes: HandoverNote[];
}
