import {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface NumberFieldProps {
  label: string;

  placeholder?: string;

  registration: UseFormRegisterReturn;

  error?: FieldError;
}