"use client";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { cn } from "@/lib/utils/cn";

type FieldTextProps = TextFieldProps & {
  errorText?: string;
};

export function FieldText({ errorText, helperText, error, ...props }: FieldTextProps) {
  return (
    <TextField
      {...props}
      error={error ?? Boolean(errorText)}
      helperText={errorText ?? helperText}
    />
  );
}

type FieldSelectProps = Omit<FieldTextProps, "select" | "children"> & {
  options: { value: string; label: string }[];
};

/** Native select — avoids MUI Menu portal/z-index issues under Tailwind CSS layers. */
export function FieldSelect({
  options,
  errorText,
  helperText,
  error,
  SelectProps,
  fullWidth = true,
  ...props
}: FieldSelectProps) {
  return (
    <TextField
      {...props}
      select
      fullWidth={fullWidth}
      error={error ?? Boolean(errorText)}
      helperText={errorText ?? helperText}
      SelectProps={{
        native: true,
        ...SelectProps,
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h3 className="form-section-title">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
