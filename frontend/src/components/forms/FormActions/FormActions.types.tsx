export interface FormActionsProps {
  isSubmitting?: boolean;

  submitLabel?: string;

  resetLabel?: string;

  onReset: () => void;
}