"use client";

import { useEffect, useState } from "react";
import {
  REPORT_PERIOD_LABELS,
  type ReportPeriod,
} from "@/features/reports/types";
import { FieldSelect } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

type ReportFiltersProps = {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  generatedAt: string;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onRefresh: () => void;
};

export function ReportFilters({
  period,
  onPeriodChange,
  generatedAt,
  onExportCsv,
  onExportExcel,
  onRefresh,
}: ReportFiltersProps) {
  const [generatedLabel, setGeneratedLabel] = useState("—");

  useEffect(() => {
    setGeneratedLabel(new Date(generatedAt).toLocaleString("en-IN"));
  }, [generatedAt]);

  return (
    <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-md">
        <FieldSelect
          label="Period"
          value={period}
          onChange={(event) =>
            onPeriodChange(event.target.value as ReportPeriod)
          }
          options={(
            Object.entries(REPORT_PERIOD_LABELS) as [ReportPeriod, string][]
          ).map(([value, label]) => ({ value, label }))}
        />
        <div className="flex flex-col justify-end">
          <p className="text-xs text-muted-foreground">Generated</p>
          <p className="text-sm font-medium text-foreground">{generatedLabel}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
        <Button type="button" variant="secondary" onClick={onExportCsv}>
          Export CSV
        </Button>
        <Button type="button" onClick={onExportExcel}>
          Export Excel
        </Button>
      </div>
    </div>
  );
}
