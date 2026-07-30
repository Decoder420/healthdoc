import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface SearchAutocompleteProps<T> {
  label: string;
  placeholder?: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  /** Secondary line under the label, e.g. an ICD code or drug strength */
  getOptionSubtext?: (option: T) => string | undefined;
  isOptionEqualToValue: (a: T, b: T) => boolean;
  /**
   * Called on every keystroke. Wire this to a real search API later —
   * for now, pass a local filter function against mock data.
   */
  onInputChange?: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
}

/**
 * Generic type-to-search dropdown. Built for the ICD-10 picker, but
 * intentionally generic — reuse this for medicine search (Week 4) and
 * lab/radiology test search (Orders panel) instead of building new
 * pickers each time. Swap `options`/`loading` from a real API call
 * once the relevant search endpoint is confirmed; the UI doesn't change.
 */
export function SearchAutocomplete<T>({
  label,
  placeholder,
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionSubtext,
  isOptionEqualToValue,
  onInputChange,
  loading = false,
  disabled = false,
  helperText,
  error = false,
}: SearchAutocompleteProps<T>) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => onInputChange?.(newInputValue)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      disabled={disabled}
      renderOption={(props, option) => {
        const subtext = getOptionSubtext?.(option);
        return (
          <Box component="li" {...props} key={getOptionLabel(option)}>
            <Box>
              <Typography sx={{ fontSize: "0.875rem" }}>{getOptionLabel(option)}</Typography>
              {subtext && (
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{subtext}</Typography>
              )}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}


