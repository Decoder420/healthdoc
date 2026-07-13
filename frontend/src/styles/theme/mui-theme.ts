import { createTheme } from "@mui/material/styles";
import { meridian } from "./meridian";

export const muiTheme = createTheme({
  modularCssLayers: true,
  palette: {
    mode: "dark",
    primary: {
      main: meridian.brandGold,
      light: meridian.brandGoldBright,
      dark: meridian.brandGoldDeep,
      contrastText: "#1a1000",
    },
    secondary: {
      main: meridian.brandGoldBright,
      contrastText: "#1a1000",
    },
    success: {
      main: meridian.success,
      contrastText: "#042f1a",
    },
    warning: {
      main: meridian.warning,
      contrastText: "#1a1000",
    },
    error: {
      main: meridian.danger,
      contrastText: "#1a1000",
    },
    text: {
      primary: meridian.textPrimary,
      secondary: meridian.textSecondary,
      disabled: meridian.textMuted,
    },
    background: {
      default: meridian.canvas,
      paper: meridian.surface,
    },
    divider: meridian.border,
  },
  typography: {
    fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #f5cc50 0%, #d4af37 55%, #b8962e 100%)",
          color: "#1a1000",
          "&:hover": {
            background: "linear-gradient(135deg, #fff8e7 0%, #f5cc50 55%, #d4af37 100%)",
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
          backgroundColor: meridian.surface,
          borderColor: meridian.border,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: meridian.surface,
          color: meridian.textPrimary,
          boxShadow: "0 1px 3px 0 rgb(212 175 55 / 0.12)",
          borderBottom: `1px solid ${meridian.border}`,
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
  },
});
