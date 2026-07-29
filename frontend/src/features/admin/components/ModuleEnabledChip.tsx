"use client";

import { StatusChip } from "@/components/ui/StatusChip";

export function ModuleEnabledChip({ enabled }: { enabled: boolean }) {
  return (
    <StatusChip
      status={enabled ? "active" : "cancelled"}
      label={enabled ? "Enabled" : "Disabled"}
    />
  );
}
