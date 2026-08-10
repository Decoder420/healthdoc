export interface SearchOption {
  label: string;
  value: string;
}

export interface SearchSelectProps {
  label: string;

  placeholder?: string;

  options: SearchOption[];

  value: string;

  onChange: (value: string) => void;
}