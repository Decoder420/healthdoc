"use client";

import { StatusChip } from "@/components/ui/StatusChip";
import { APPROVAL_STATUS_LABELS } from "../constants";
import type { ApprovalStatus } from "../types";

export function ApprovalStatusChip({ status }: { status: ApprovalStatus }) {
  return (
    <StatusChip
      status={status === "approved" ? "success" : status === "rejected" ? "failed" : "pending"}
      label={APPROVAL_STATUS_LABELS[status]}
    />
  );
}
