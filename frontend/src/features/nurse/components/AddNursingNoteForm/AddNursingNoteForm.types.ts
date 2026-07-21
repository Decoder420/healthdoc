import type {
  AddNursingNoteSchema,
} from "@/features/nurse/validation/nursingNote.schema";

export interface AddNursingNoteFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddNursingNoteSchema
  ) => Promise<boolean> | boolean;
}