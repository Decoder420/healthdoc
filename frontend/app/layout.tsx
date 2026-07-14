import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthDoc HMIS",
  description: "Hospital Information Management System",
};

// F1-W1-04 replaces this with the real shell: sidebar nav, top bar, role-based menu.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
