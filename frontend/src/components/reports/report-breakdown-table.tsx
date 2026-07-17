"use client";

import type { ReportBreakdownRow } from "@/features/reports/types";

type ReportBreakdownTableProps = {
  title: string;
  description?: string;
  rows: ReportBreakdownRow[];
  valueLabel?: string;
  formatValue?: (value: number) => string;
};

export function ReportBreakdownTable({
  title,
  description,
  rows,
  valueLabel = "Count",
  formatValue = (value) => value.toLocaleString("en-IN"),
}: ReportBreakdownTableProps) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">{valueLabel}</th>
              <th className="px-5 py-3 font-medium">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                  No records available.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{row.label}</p>
                    {(row.secondary || row.meta) && (
                      <p className="text-xs text-muted-foreground">
                        {[row.secondary, row.meta].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-foreground">
                    {formatValue(row.value)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.round((row.value / max) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-muted-foreground">
                        {Math.round((row.value / max) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
