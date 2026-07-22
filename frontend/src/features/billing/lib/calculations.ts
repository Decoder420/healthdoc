import type { InvoiceItem, InvoiceStatus, Payment, Refund } from "../types";
import { fromMoney, round2, toMoney, type Money } from "./money";

export { round2, toMoney, fromMoney } from "./money";

export function lineAmount(quantity: number, unit_price: Money | number): Money {
  return toMoney(Math.max(0, quantity) * Math.max(0, fromMoney(unit_price)));
}

export function withLineAmount<
  T extends Pick<InvoiceItem, "quantity" | "unit_price"> & { amount?: Money },
>(item: T): T & { amount: Money } {
  return {
    ...item,
    unit_price: toMoney(fromMoney(item.unit_price)),
    amount: lineAmount(item.quantity, item.unit_price),
  };
}

export function sumGross(items: Pick<InvoiceItem, "amount">[]): Money {
  return toMoney(items.reduce((sum, row) => sum + fromMoney(row.amount), 0));
}

export function computeNet(
  gross_amount: Money | number,
  discount_amount: Money | number,
  scheme_adjustment: Money | number,
): Money {
  return toMoney(
    Math.max(
      0,
      fromMoney(gross_amount) -
        Math.max(0, fromMoney(discount_amount)) -
        Math.max(0, fromMoney(scheme_adjustment)),
    ),
  );
}

export function recomputeInvoiceTotals(
  items: Pick<InvoiceItem, "amount">[],
  discount_amount: Money | number,
  scheme_adjustment: Money | number,
): { gross_amount: Money; net_amount: Money } {
  const gross_amount = sumGross(items);
  return {
    gross_amount,
    net_amount: computeNet(gross_amount, discount_amount, scheme_adjustment),
  };
}

export function paidTotal(payments: Pick<Payment, "amount" | "status">[]): Money {
  return toMoney(
    payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + fromMoney(p.amount), 0),
  );
}

export function refundedTotal(refunds: Pick<Refund, "amount">[]): Money {
  return toMoney(refunds.reduce((sum, r) => sum + fromMoney(r.amount), 0));
}

/**
 * Balance due:
 * - Count success payments toward the invoice
 * - Count refunds only while their payment is still success (partial reverse)
 * - Full reverse sets payment to reversed → drops from paid side; those refunds
 *   are excluded here so we do not double-restore the balance
 */
export function balanceDue(
  net_amount: Money | number,
  payments: Pick<Payment, "id" | "amount" | "status">[],
  refunds: Pick<Refund, "payment_id" | "amount">[],
): Money {
  const paid = fromMoney(paidTotal(payments));
  const successIds = new Set(
    payments.filter((p) => p.status === "success").map((p) => p.id),
  );
  const refundedOnOpen = round2(
    refunds
      .filter((r) => successIds.has(r.payment_id))
      .reduce((sum, r) => sum + fromMoney(r.amount), 0),
  );
  return toMoney(Math.max(0, fromMoney(net_amount) - paid + refundedOnOpen));
}

export function nextInvoiceStatusAfterPaymentActivity(
  current: InvoiceStatus,
  balance: Money | number,
  hasSuccessfulPayment: boolean,
): InvoiceStatus {
  if (current === "draft" || current === "cancelled" || current === "waived") {
    return current;
  }
  if (fromMoney(balance) <= 0) return "paid";
  if (hasSuccessfulPayment) return "partially_paid";
  return "issued";
}
