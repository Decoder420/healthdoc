import { AddPatientMovementSchema } from "./validation";

export interface AddPatientMovementFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddPatientMovementSchema
  ) => Promise<void> | void;
}