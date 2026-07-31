"use client";

import { AppProviders } from "@/components/providers";
import { OpdQueueProvider } from "@/features/opd/context/opd-queue-context";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <QueryProvider>
        <AuthProvider>
          <OpdQueueProvider>{children}</OpdQueueProvider>
        </AuthProvider>
      </QueryProvider>
    </AppProviders>
  );
}
