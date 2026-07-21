import type { AddVitalsSchema } from "@/features/nurse/validation/vitals.schema";

export interface AddVitalsFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddVitalsSchema
  ) => Promise<boolean> | boolean;
}