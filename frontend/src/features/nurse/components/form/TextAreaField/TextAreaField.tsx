import { TextAreaFieldProps } from "./TextAreaField.types";

export default function TextAreaField({
  label,
  placeholder,
  rows = 4,
  registration,
  error,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <textarea
        rows={rows}
        placeholder={placeholder}
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