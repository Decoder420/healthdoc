import type { AddIntakeOutputSchema } from "./validation";

export interface AddIntakeOutputFormProps {
  admissionId: string;

  isSubmitting?: boolean;

  onSubmit: (data: AddIntakeOutputSchema) => Promise<boolean> | boolean;
}