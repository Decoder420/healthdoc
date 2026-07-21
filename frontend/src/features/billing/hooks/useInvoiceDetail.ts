"use client";

import { useCallback, useEffect, useState } from "react";

import { getInvoice } from "../api";
import type { InvoiceWithItems } from "../types";

export function useInvoiceDetail(invoiceId: string | null) {
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!invoiceId) {
      setInvoice(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const row = await getInvoice(invoiceId);
      setInvoice(row);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoice");
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { invoice, setInvoice, loading, error, refresh };
}
