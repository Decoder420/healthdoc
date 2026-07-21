import { AddProcedureAssistanceSchema } from "./validation";

export interface AddProcedureAssistanceFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddProcedureAssistanceSchema
  ) => Promise<void> | void;
}