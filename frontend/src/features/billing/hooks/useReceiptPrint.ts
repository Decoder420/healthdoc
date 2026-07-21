"use client";

import { useCallback, useState } from "react";

export function useReceiptPrint() {
  const [printPaymentId, setPrintPaymentId] = useState<string | null>(null);

  const openPrint = useCallback((paymentId: string) => {
    setPrintPaymentId(paymentId);
  }, []);

  const closePrint = useCallback(() => {
    setPrintPaymentId(null);
  }, []);

  const print = useCallback(() => {
    window.print();
  }, []);

  return { printPaymentId, openPrint, closePrint, print };
}
