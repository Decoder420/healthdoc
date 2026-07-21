"use client";

import { StatusChip } from "@/components/ui/StatusChip";
import { PAYMENT_STATUS_LABELS } from "../constants";
import type { PaymentStatus } from "../types";

export function PaymentStatusChip({ status }: { status: PaymentStatus }) {
  return <StatusChip status={status} label={PAYMENT_STATUS_LABELS[status]} />;
}
