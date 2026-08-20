"use client";

import { useCallback, useState } from "react";

import { createRefund } from "../api";
import { toast } from "@/components/ui/toast";
import type { CreateRefundInput, InvoiceWithItems, PaymentWithRefunds, Refund } from "../types";

export function usePaymentRefund(
  paymentId: string | null,
  onSaved?: (invoice: InvoiceWithItems, payment: PaymentWithRefunds, refund: Refund) => void,
) {
  const [busy, setBusy] = useState(false);

  const submit = useCallback(
    async (body: CreateRefundInput) => {
      if (!paymentId) return;
      setBusy(true);
      try {
        const result = await createRefund(paymentId, body);
        toast.success("Payment reversed", result.refund.refund_number);
        onSaved?.(result.invoice, result.payment, result.refund);
        return result;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Reversal failed");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [onSaved, paymentId],
  );

  return { submit, busy };
}
