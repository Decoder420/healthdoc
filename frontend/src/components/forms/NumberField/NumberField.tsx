import { NumberFieldProps } from "./NumberField.types";

export default function NumberField({
  label,
  placeholder,
  registration,
  error,
}: NumberFieldProps) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
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