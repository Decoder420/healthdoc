import type { Metadata } from "next";
import { fontVariables } from "@/styles/fonts";
import { AppProviders } from "@/providers";
import BootstrapClient from "@/components/BootstrapClient";
import { ThemeScript } from "@/providers/theme-script";
import "./globals.css";
import "@/styles/anchor.css";

export const metadata: Metadata = {
  title: "HealthDoc HMIS",
  description: "Hospital Information Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <BootstrapClient />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
