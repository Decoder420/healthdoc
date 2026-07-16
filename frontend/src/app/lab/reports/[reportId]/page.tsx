import { Suspense } from "react";
import Report from "@/components/pathology/week1/reportviewer/report";
import { report as dummyReport } from "@/components/pathology/week1/reportviewer/data/report";

function ReportLoading() {
  return (
    <div className="report-premium-shell flex min-h-screen items-center justify-center px-4">
      <div className="report-loading-card w-full max-w-md rounded-2xl border border-white/50 bg-white/70 p-8 text-center shadow-[0_24px_80px_rgba(0,31,84,0.12)] backdrop-blur-xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#001f54]/20 border-t-[#001f54]" />
        <p
          className="text-lg font-semibold text-[#001f54]"
          style={{ fontFamily: "var(--font-report-display), Georgia, serif" }}
        >
          Preparing report
        </p>
        <p className="mt-1 text-sm text-slate-500">
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
