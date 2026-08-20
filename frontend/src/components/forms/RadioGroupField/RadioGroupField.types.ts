export interface RadioOption {
    label: string;
    value: string;
  }
  
  export interface RadioGroupFieldProps {
    label: string;
    name: string;
    value: string;
    options: RadioOption[];
    onChange: (value: string) => void;
    error?: { message: string };
  }