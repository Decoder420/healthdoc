import { RadioGroupFieldProps } from "./RadioGroupField.types";

export default function RadioGroupField({
  label,
  value,
  options,
  onChange,
}: RadioGroupFieldProps) {
  return (
    <div className="space-y-3">

      <label className="text-sm font-medium">
        {label}
      </label>

      <div className="flex flex-wrap gap-6">

        {options.map((option) => (

          <label
            key={option.value}
            className="flex items-center gap-2"
          >

            <input
              type="radio"
              checked={value === option.value}
              onChange={() =>
                onChange(option.value)
              }
            />

            <span className="text-sm">
              {option.label}
            </span>

          </label>

        ))}

      </div>

    </div>
  );
}