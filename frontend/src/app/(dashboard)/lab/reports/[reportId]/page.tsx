import { Suspense } from "react";
import Report from "@/components/shared/labreportviewer/report";
import { report as dummyReport } from "@/components/shared/labreportviewer/data/report";

function ReportLoading() {
  return (
    <div className="report-premium-shell flex min-h-screen items-center justify-center bg-background px-4">
      <div className="surface-card w-full max-w-md p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p
          className="text-lg font-semibold text-primary"
          style={{ fontFamily: "var(--font-report-display), Georgia, serif" }}
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
  return (
    <Suspense fallback={<ReportLoading />}>
      <Report report={dummyReport} />
    </Suspense>
  );
}
