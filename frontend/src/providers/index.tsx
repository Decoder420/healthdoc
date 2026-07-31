"use client";

import { ThemeProvider } from "./theme-provider";
import { MuiProvider } from "./mui-provider";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { OpdQueueProvider } from "@/features/opd/context/opd-queue-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MuiProvider>
        <QueryProvider>
          <AuthProvider>
            <OpdQueueProvider>{children}</OpdQueueProvider>
          </AuthProvider>
        </QueryProvider>
      </MuiProvider>
    </ThemeProvider>
  );
}
