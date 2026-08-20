"use client";

import { StatusChip } from "@/components/ui/StatusChip";
import { INVOICE_STATUS_LABELS } from "../constants";
import type { InvoiceStatus } from "../types";

const LABELS: Record<string, string> = {
  draft: INVOICE_STATUS_LABELS.draft,
  issued: INVOICE_STATUS_LABELS.issued,
  partially_paid: INVOICE_STATUS_LABELS.partially_paid,
  paid: INVOICE_STATUS_LABELS.paid,
  waived: INVOICE_STATUS_LABELS.waived,
  cancelled: INVOICE_STATUS_LABELS.cancelled,
};

export function InvoiceStatusChip({ status }: { status: InvoiceStatus }) {
  return <StatusChip status={status} label={LABELS[status] ?? status} />;
}
