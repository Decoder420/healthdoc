"use client";

import { StatusChip } from "@/components/ui/StatusChip";

export function ActiveStatusChip({ active }: { active: boolean }) {
  return (
    <StatusChip
      status={active ? "active" : "cancelled"}
      label={active ? "Active" : "Inactive"}
    />
  );
}
