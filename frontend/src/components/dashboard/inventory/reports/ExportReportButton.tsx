"use client";

import type { InventoryReportRow } from "@/features/inventory/types/report";

import { exportInventoryReport } from "@/lib/utils/reportExcel";

interface Props {
  rows: InventoryReportRow[];
  reportName: string;
  disabled?: boolean;
}

export default function ExportReportButton({
  rows,
  reportName,
  disabled = false,
}: Props) {
  const handleExport = () => {
    if (rows.length === 0) {
      return;
    }

    exportInventoryReport(
      rows,
      reportName
    );
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={
        disabled ||
        rows.length === 0
      }
      className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      Export Report
    </button>
  );
}