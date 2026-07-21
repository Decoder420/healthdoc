import { AddHandoverSchema } from "./validation";

export interface AddHandoverFormProps {
  patientId: string;

  isSubmitting?: boolean;

  onSubmit: (
    data: AddHandoverSchema
  ) => Promise<void> | void;
}