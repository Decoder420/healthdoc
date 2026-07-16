"use client";

import { cn } from "@/lib/utils/cn";
import {
  REPORT_TAB_LABELS,
  type ReportTabId,
} from "@/features/reports/types";

type ReportTabsProps = {
  active: ReportTabId;
  onChange: (tab: ReportTabId) => void;
};

const TABS: ReportTabId[] = [
  "overview",
  "patients",
  "appointments",
  "doctors",
  "ipd",
  "revenue",
];

export function ReportTabs({ active, onChange }: ReportTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-3">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-accent",
            )}
          >
            {REPORT_TAB_LABELS[tab]}
          </button>
        );
      })}
    </div>
  );
}
