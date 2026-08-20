"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { muiTheme } from "@/styles/theme";
import { Toaster } from "@/components/ui/Toaster";
import { MockSessionProvider } from "@/lib/session/mockSession";
import { AuthProvider } from "@/providers/auth-provider";

const LAYER_ORDER = "@layer theme, base, mui, components, utilities;";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      {/* Must be first so Tailwind preflight cannot override MUI (padding/gap). */}
      <GlobalStyles styles={LAYER_ORDER} />
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {/* AuthProvider outside MockSessionProvider: real identity, where it
            exists, is the outer fact. MockSessionProvider stays for now because
            the ported screens still read their role from it — removing it is a
            follow-up once those screens move onto useAuth(). */}
        <AuthProvider>
          <MockSessionProvider>
            {children}
            <Toaster />
          </MockSessionProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
