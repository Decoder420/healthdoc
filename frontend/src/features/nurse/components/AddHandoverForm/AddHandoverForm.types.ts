import { AddHandoverSchema } from "./validation";
import type { HandoverRecipientOption } from "@/features/nurse/types";

export interface AddHandoverFormProps {
  admissionId: string;
  isSubmitting?: boolean;
  /** Prior recipients on this admission (FE-only picker; /users is admin-only). */
  recipientOptions?: HandoverRecipientOption[];
  onSubmit: (data: AddHandoverSchema) => Promise<boolean> | boolean;
}
