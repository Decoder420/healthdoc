import { DateTimeFieldProps } from "./DateTimeField.types";

export default function DateTimeField({
  label,
  registration,
  error,
}: DateTimeFieldProps) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type="datetime-local"
        className="
          w-full
          rounded-lg
          border
          border-border
          bg-background
          px-3
          py-2.5
          text-sm
          outline-none
          focus:border-primary
        "
        {...registration}
      />

      {error && (
        <p className="text-xs text-danger">
          {error.message}
        </p>
      )}

    </div>
  );
}