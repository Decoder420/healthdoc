import type { AddProcedureAssistanceSchema } from "./validation.ts";

export interface AddProcedureAssistanceFormProps {
  encounterId: string;
  patientId: string;
  assistedBy: string;
  isSubmitting?: boolean;
  onSubmit: (data: AddProcedureAssistanceSchema) => Promise<boolean> | boolean;
}