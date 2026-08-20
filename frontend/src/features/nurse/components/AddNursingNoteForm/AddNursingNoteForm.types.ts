import type { AddNursingNoteSchema } from "./validation";

export interface AddNursingNoteFormProps {
  encounterId: string;
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (data: AddNursingNoteSchema) => Promise<boolean> | boolean;
}
