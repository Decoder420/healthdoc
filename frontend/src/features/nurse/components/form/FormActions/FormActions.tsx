import { FormActionsProps } from "./FormActions.types";

export default function FormActions({
  isSubmitting = false,
  submitLabel = "Save",
  resetLabel = "Reset",
  onReset,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">

      <button
        type="button"
        onClick={onReset}
        className="btn btn-outline"
      >
        {resetLabel}
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary"
      >
        {isSubmitting
          ? "Saving..."
          : submitLabel}
      </button>

    </div>
  );
}