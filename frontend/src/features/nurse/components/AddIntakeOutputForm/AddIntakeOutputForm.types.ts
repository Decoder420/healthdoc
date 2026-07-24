import type { AddIntakeOutputSchema } from "@/features/nurse/validation/intakeOutput.schema";

export interface AddIntakeOutputFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddIntakeOutputSchema
  ) => Promise<boolean> | boolean;
}