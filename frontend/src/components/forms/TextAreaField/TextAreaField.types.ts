import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface TextAreaFieldProps {
  label: string;

  placeholder?: string;

  rows?: number;

  // Optional native character cap matching the zod .max() rule (e.g. 500
  // for notes/remarks fields) — gives the user a hard stop and, paired
  // with a browser's built-in counter UI, earlier feedback than waiting
  // for form submit to see the zod error.
  maxLength?: number;

  registration: UseFormRegisterReturn;

  error?: FieldError;
}
