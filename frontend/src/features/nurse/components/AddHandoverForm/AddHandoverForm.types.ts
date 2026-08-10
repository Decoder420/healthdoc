import { AddHandoverSchema } from "./validation";

export interface AddHandoverFormProps {
  admissionId: string;

  isSubmitting?: boolean;

  onSubmit: (data: AddHandoverSchema) => Promise<void> | void;
}
