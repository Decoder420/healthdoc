"use client";

import type { ReportKpi } from "@/features/reports/types";

type ReportKpiGridProps = {
  kpis: ReportKpi[];
};

export function ReportKpiGrid({ kpis }: ReportKpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="surface-card p-5">
          <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {kpi.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
          {kpi.trend && (
            <p className="mt-2 text-xs font-medium text-primary">{kpi.trend}</p>
          )}
        </div>
      ))}
    </div>
  );
}
