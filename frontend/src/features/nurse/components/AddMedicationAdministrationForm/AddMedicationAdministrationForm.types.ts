import { AddMedicationAdministrationSchema } from "./validation";

export interface AddMedicationAdministrationFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddMedicationAdministrationSchema
  ) => Promise<void> | void;
}