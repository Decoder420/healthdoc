"use client";

import MenuItem from "@mui/material/MenuItem";
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

type FieldSelectProps = FieldTextProps & {
  options: { value: string; label: string }[];
};

export function FieldSelect({ options, errorText, helperText, error, ...props }: FieldSelectProps) {
  return (
    <TextField
      {...props}
      select
      error={error ?? Boolean(errorText)}
      helperText={errorText ?? helperText}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
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
