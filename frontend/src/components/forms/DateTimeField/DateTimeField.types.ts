import {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface DateTimeFieldProps {
  label: string;

  registration: UseFormRegisterReturn;

  error?: FieldError;
}