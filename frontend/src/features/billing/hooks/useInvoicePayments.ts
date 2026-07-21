"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getInvoiceBalance, listPayments } from "../api";
import { balanceDue, paidTotal } from "../lib/calculations";
import type { PaymentWithRefunds } from "../types";

export function useInvoicePayments(invoiceId: string | null) {
  const [payments, setPayments] = useState<PaymentWithRefunds[]>([]);
  const [balance, setBalance] = useState({
    net_amount: 0,
    paid_total: 0,
    refunded_total: 0,
    balance_due: 0,
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!invoiceId) {
      setPayments([]);
      setBalance({ net_amount: 0, paid_total: 0, refunded_total: 0, balance_due: 0 });
      return;
    }
    setLoading(true);
    try {
      const [rows, bal] = await Promise.all([
        listPayments(invoiceId),
        getInvoiceBalance(invoiceId),
      ]);
      setPayments(rows);
      setBalance(bal);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const derived = useMemo(() => {
    const flatRefunds = payments.flatMap((p) => p.refunds);
    return {
      paid_total: paidTotal(payments),
      balance_due: balanceDue(balance.net_amount, payments, flatRefunds),
    };
  }, [payments, balance.net_amount]);

  return {
    payments,
    loading,
    balance,
    paid_total: balance.paid_total || derived.paid_total,
    balance_due: balance.balance_due,
    refunded_total: balance.refunded_total,
    refresh,
  };
}
