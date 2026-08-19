import { RadioGroupFieldProps } from "./RadioGroupField.types";

export default function RadioGroupField({
  label,
  name,
  value,
  options,
  onChange,
  error,
}: RadioGroupFieldProps) {
  const errorId = `field-${name}-error`;
  const hasError = Boolean(error);

  return (
    // <fieldset>/<legend> is the correct semantic wrapper for a group of
    // related radio inputs — screen readers announce the legend once for
    // the whole group, rather than relying on a plain <label> that isn't
    // associated with any single control.
    <fieldset
      className="space-y-3"
      aria-describedby={hasError ? errorId : undefined}
    >
      <legend className="text-sm font-medium">{label}</legend>

      <div className="flex flex-wrap gap-6">
        {options.map((option) => {
          const optionId = `field-${name}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex items-center gap-2"
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                checked={isChecked}
                onChange={() => onChange(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          );
        })}
      </div>

      {hasError && (
        <p id={errorId} className="text-xs text-danger">
          {error?.message}
        </p>
      )}
    </fieldset>
  );
}