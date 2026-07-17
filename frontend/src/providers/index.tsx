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
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
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
