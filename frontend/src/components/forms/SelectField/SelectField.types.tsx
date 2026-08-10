import {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectFieldProps {
  label: string;

  options: SelectOption[];

  registration: UseFormRegisterReturn;

  error?: FieldError;
}