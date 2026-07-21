import { AddIntakeOutputSchema } from "./validation";

export interface AddIntakeOutputFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddIntakeOutputSchema
  ) => Promise<void> | void;
}