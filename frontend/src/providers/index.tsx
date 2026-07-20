"use client";

import { useMemo } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useThemeMode } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { createAppTheme } from "@/styles/theme";

function MuiBridge({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeMode();
  const muiTheme = useMemo(() => createAppTheme(theme), [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/*
        Do NOT enable CSS layers here. Tailwind v4 preflight lives in @layer base and
        sets `button { background-color: transparent }`. If Emotion registers the
        `mui` layer before globals.css declares layer order, that preflight wins and
        MUI contained buttons lose red/blue/green fills until a hard refresh.
        Unlayered MUI styles always beat layered Tailwind/Bootstrap.
      */}
      <AppRouterCacheProvider options={{ key: "mui", prepend: true }}>
        <MuiBridge>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </MuiBridge>
      </AppRouterCacheProvider>
    </ThemeProvider>
  );
}

/** @deprecated use AppProviders from @/providers */
export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
