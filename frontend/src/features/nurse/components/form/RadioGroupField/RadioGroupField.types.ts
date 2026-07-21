export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupFieldProps {
  label: string;

  value: string;

  options: RadioOption[];

  onChange: (value: string) => void;
}