"use client";

import { createTheme } from "@mui/material/styles";
import { meridian } from "./meridian";

const baseTheme = {
  typography: {
    fontFamily: "var(--font-ibm-plex-sans), Arial, sans-serif",
    fontSize: 14,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined" as const,
        size: "small" as const,
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--background)",
            "& fieldset": {
              borderColor: "var(--border)",
            },
            "&:hover fieldset": {
              borderColor: meridian.primary,
            },
            "&.Mui-focused fieldset": {
              borderColor: meridian.primary,
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: meridian.primary,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: "0.75rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
};

export const muiTheme = createTheme({
  ...baseTheme,
  modularCssLayers: true,
  palette: {
    mode: "light",
    primary: {
      main: meridian.primary,
      contrastText: meridian.primaryForeground,
    },
    background: {
      default: meridian.background,
      paper: meridian.card,
    },
    text: {
      primary: meridian.foreground,
      secondary: meridian.mutedForeground,
    },
    error: {
      main: meridian.danger,
    },
    divider: meridian.border,
  },
});

export const muiDarkTheme = createTheme({
  ...baseTheme,
  modularCssLayers: true,
  palette: {
    mode: "dark",
    primary: {
      main: meridian.dark.primary,
      contrastText: meridian.primaryForeground,
    },
    background: {
      default: meridian.dark.background,
      paper: meridian.dark.card,
    },
    text: {
      primary: meridian.dark.foreground,
      secondary: meridian.dark.mutedForeground,
    },
    error: {
      main: "#f87171",
    },
    divider: meridian.dark.border,
  },
});
