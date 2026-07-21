import type { InvoiceItem, InvoiceStatus, Payment, Refund } from "../types";

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function lineAmount(quantity: number, unit_price: number): number {
  return round2(Math.max(0, quantity) * Math.max(0, unit_price));
}

export function withLineAmount<T extends Pick<InvoiceItem, "quantity" | "unit_price">>(
  item: T,
): T & { amount: number } {
  return { ...item, amount: lineAmount(item.quantity, item.unit_price) };
}

export function sumGross(items: Pick<InvoiceItem, "amount">[]): number {
  return round2(items.reduce((sum, row) => sum + row.amount, 0));
}

export function computeNet(
  gross_amount: number,
  discount_amount: number,
  scheme_adjustment: number,
): number {
  return round2(
    Math.max(0, gross_amount - Math.max(0, discount_amount) - Math.max(0, scheme_adjustment)),
  );
}

export function recomputeInvoiceTotals(
  items: Pick<InvoiceItem, "amount">[],
  discount_amount: number,
  scheme_adjustment: number,
): { gross_amount: number; net_amount: number } {
  const gross_amount = sumGross(items);
  return {
    gross_amount,
    net_amount: computeNet(gross_amount, discount_amount, scheme_adjustment),
  };
}

export function paidTotal(payments: Pick<Payment, "amount" | "status">[]): number {
  return round2(
    payments.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0),
  );
}

export function refundedTotal(refunds: Pick<Refund, "amount">[]): number {
  return round2(refunds.reduce((sum, r) => sum + r.amount, 0));
}

/**
 * Balance due:
 * - Count success payments toward the invoice
 * - Count refunds only while their payment is still success (partial reverse)
 * - Full reverse sets payment to reversed → drops from paid side; those refunds
 *   are excluded here so we do not double-restore the balance
 */
export function balanceDue(
  net_amount: number,
  payments: Pick<Payment, "id" | "amount" | "status">[],
  refunds: Pick<Refund, "payment_id" | "amount">[],
): number {
  const paid = paidTotal(payments);
  const successIds = new Set(
    payments.filter((p) => p.status === "success").map((p) => p.id),
  );
  const refundedOnOpen = round2(
    refunds
      .filter((r) => successIds.has(r.payment_id))
      .reduce((sum, r) => sum + r.amount, 0),
  );
  return round2(Math.max(0, net_amount - paid + refundedOnOpen));
}

export function nextInvoiceStatusAfterPaymentActivity(
  current: InvoiceStatus,
  balance: number,
  hasSuccessfulPayment: boolean,
): InvoiceStatus {
  if (current === "draft" || current === "cancelled" || current === "waived") {
    return current;
  }
  if (balance <= 0) return "paid";
  if (hasSuccessfulPayment) return "partially_paid";
  return "issued";
}
