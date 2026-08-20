"use client";

import { useCallback, useState } from "react";

import { collectPayment } from "../api";
import { toast } from "@/components/ui/toast";
import type { CollectPaymentInput, InvoiceWithItems, Payment } from "../types";

export function useCollectPayment(
  invoiceId: string | null,
  onSaved?: (invoice: InvoiceWithItems, payment: Payment) => void,
) {
  const [busy, setBusy] = useState(false);

  const submit = useCallback(
    async (body: CollectPaymentInput) => {
      if (!invoiceId) return;
      setBusy(true);
      try {
        const result = await collectPayment(invoiceId, body);
        toast.success("Payment collected", result.payment.receipt_number);
        onSaved?.(result.invoice, result.payment);
        return result;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Payment failed");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [invoiceId, onSaved],
  );

  return { submit, busy };
}
