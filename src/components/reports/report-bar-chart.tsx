"use client";

import type { ReportSeriesPoint } from "@/features/reports/types";

type ReportBarChartProps = {
  title: string;
  description?: string;
  data: ReportSeriesPoint[];
  valuePrefix?: string;
};

export function ReportBarChart({
  title,
  description,
  data,
  valuePrefix = "",
}: ReportBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="surface-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No data for this period.
        </p>
      ) : (
        <div className="flex h-48 items-end gap-2">
          {data.map((item) => {
            const height = Math.max(6, Math.round((item.value / max) * 100));
            return (
              <div
                key={item.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <span className="text-[10px] font-medium text-muted-foreground">
                  {valuePrefix}
                  {typeof item.value === "number"
                    ? item.value.toLocaleString("en-IN")
                    : item.value}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/85 transition-all"
                    style={{ height: `${height}%` }}
                    title={`${item.label}: ${valuePrefix}${item.value}`}
                  />
                </div>
                <span className="w-full truncate text-center text-[10px] text-muted-foreground">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
