import type { Metadata } from "next";
import { fontVariables } from "@/styles/fonts";
import { Providers } from "@/components/providers";
import MainLayout from "@/components/common/MainLayout";
import "@/styles/globals.css";

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
    <html lang="en" className={fontVariables}>
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
