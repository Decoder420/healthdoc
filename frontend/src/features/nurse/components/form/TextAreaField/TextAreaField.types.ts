import {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface TextAreaFieldProps {
  label: string;

  placeholder?: string;

  rows?: number;

  registration: UseFormRegisterReturn;

  error?: FieldError;
}