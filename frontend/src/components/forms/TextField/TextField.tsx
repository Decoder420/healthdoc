import { TextFieldProps } from "./TextField.types";

export default function TextField({
  label,
  placeholder,
  registration,
  error,
  type = "text",
}: TextFieldProps) {
  const fieldId = `field-${registration.name}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>

      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
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
        <p id={errorId} className="text-xs text-danger">
          {error.message}
        </p>
      )}
    </div>
  );
}
