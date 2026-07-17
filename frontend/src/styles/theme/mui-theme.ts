import { createTheme, type Theme } from "@mui/material/styles";
import { meridianDark, meridianLight } from "./meridian";
import type { ThemeMode } from "@/providers/theme-provider";

export function createAppTheme(mode: ThemeMode): Theme {
  const tokens = mode === "dark" ? meridianDark : meridianLight;

  return createTheme({
    modularCssLayers: true,
    palette: {
      mode,
      primary: {
        main: tokens.brandPrimary,
        dark: tokens.brandDeep,
        contrastText: "#ffffff",
      },
      secondary: {
        main: tokens.textSecondary,
        contrastText: mode === "dark" ? "#000000" : "#ffffff",
      },
      success: {
        main: tokens.success,
        contrastText: mode === "dark" ? "#000000" : "#ffffff",
      },
      warning: {
        main: tokens.warning,
        contrastText: mode === "dark" ? "#000000" : "#ffffff",
      },
      error: {
        main: tokens.danger,
        contrastText: "#ffffff",
      },
      info: {
        main: tokens.info,
        contrastText: mode === "dark" ? "#000000" : "#ffffff",
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
        disabled: tokens.textMuted,
      },
      background: {
        default: tokens.canvas,
        paper: tokens.surface,
      },
      divider: tokens.border,
    },
    typography: {
      fontFamily:
        'var(--font-ibm-plex-sans), "IBM Plex Sans", system-ui, sans-serif',
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: tokens.canvas,
            color: tokens.textPrimary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          root: {
            flexShrink: 0,
          },
          paper: {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surface,
            color: tokens.textPrimary,
            boxShadow:
              mode === "dark"
                ? "0 1px 0 0 rgb(255 255 255 / 0.06)"
                : "0 1px 3px 0 rgb(0 31 84 / 0.06)",
            borderBottom: `1px solid ${tokens.border}`,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}

/** @deprecated use createAppTheme */
export const muiTheme = createAppTheme("light");
