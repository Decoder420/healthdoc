import {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface TextFieldProps {
  label: string;

  placeholder?: string;

  registration: UseFormRegisterReturn;

  error?: FieldError;

  type?: "text" | "email" | "password";
}