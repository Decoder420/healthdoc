import { SelectFieldProps } from "./SelectField.types";

export default function SelectField({
  label,
  options,
  registration,
  error,
}: SelectFieldProps) {
  const fieldId = `field-${registration.name}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>

      <select
        id={fieldId}
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error.message}
        </p>
      )}
    </div>
  );
}
