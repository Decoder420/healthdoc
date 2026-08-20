import type { AddProcedureAssistanceSchema } from "./validation";

export interface AddProcedureAssistanceFormProps {
  encounterId: string;
  patientId: string;
  assistedBy: string;
  isSubmitting?: boolean;
  onSubmit: (data: AddProcedureAssistanceSchema) => Promise<boolean> | boolean;
}