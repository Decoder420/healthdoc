import { DM_Sans, Fraunces } from "next/font/google";

const reportSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-report-sans",
  weight: ["400", "500", "600", "700"],
});

const reportDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-report-display",
  weight: ["500", "600", "700"],
});

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${reportSans.variable} ${reportDisplay.variable}`}>
      {children}
    </div>
  );
}
