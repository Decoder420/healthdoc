import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export function Button({ loading = false, disabled, children, startIcon, ...props }: ButtonProps) {
  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={14} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
}   