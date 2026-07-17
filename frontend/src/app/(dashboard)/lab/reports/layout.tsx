import { reportDisplay, reportSans } from "@/styles/fonts";

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
