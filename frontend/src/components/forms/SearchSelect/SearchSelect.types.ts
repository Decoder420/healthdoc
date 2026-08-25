import { FieldError } from "react-hook-form";

export interface SearchOption {
  label: string;
  value: string;
}

export interface SearchSelectProps {
  label: string;

  // Used to build stable ids for label/input association and the
  // listbox. Falls back to a slug of `label` if omitted, but passing it
  // explicitly is safer if the label text ever changes.
  name?: string;

  placeholder?: string;

  options: SearchOption[];

  value: string;

  onChange: (value: string) => void;

  error?: FieldError;
}
