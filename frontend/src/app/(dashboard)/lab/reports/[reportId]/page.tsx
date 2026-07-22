"use client";

import { Suspense } from "react";
import { notFound, useParams } from "next/navigation";

import Report from "@/components/shared/labreportviewer/report";
import { reports } from "@/components/dashboard/lab-technician/Verification/DummyData";
import { mapVerifiedReportToReportData } from "@/lib/utils/ReportMapper";

function ReportLoading() {
  return (
    <div className="report-premium-shell flex min-h-screen items-center justify-center bg-background px-4">
      <div className="surface-card w-full max-w-md p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

        <p
          className="text-lg font-semibold text-primary"
          style={{
            fontFamily: "var(--font-report-display), Georgia, serif",
          }}
        >
          Preparing report
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Loading laboratory investigation…
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  const params = useParams();

  const reportId = params.reportId as string;

  const selectedReport = reports.find(
    (item) => item.report.reportNo === reportId
  );
  console.log("Report ID:", reportId);
console.log("Selected Report:", selectedReport);

  if (!selectedReport) {
    notFound();
  }

  const reportData = mapVerifiedReportToReportData(selectedReport);

  return (
    <Suspense fallback={<ReportLoading />}>
      <Report report={reportData} />
    </Suspense>
  );
}