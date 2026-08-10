import type { AddVitalsSchema } from "./validation";

export interface AddVitalsFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (data: AddVitalsSchema) => Promise<boolean> | boolean;
}