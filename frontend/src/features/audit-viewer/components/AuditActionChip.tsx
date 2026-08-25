"use client";

import { StatusChip } from "@/components/ui/StatusChip";
import { AUDIT_ACTION_LABELS } from "../constants";

export function AuditActionChip({ action }: { action: string }) {
  return <StatusChip status={action} label={AUDIT_ACTION_LABELS[action] ?? action} />;
}
