import type {
  CollectPaymentInput,
  CreateRefundInput,
  InvoiceBalance,
  InvoiceWithItems,
  Payment,
  PaymentWithRefunds,
  Refund,
} from "../types";
import {
  balanceDue,
  nextInvoiceStatusAfterPaymentActivity,
  paidTotal,
  refundedTotal,
} from "../lib/calculations";
import { DEFAULT_CURRENCY, fromMoney, toMoney } from "../lib/money";
import {
  MOCK_CASHIER_USER_ID,
  MOCK_SUPERVISOR_USER_ID,
} from "../constants";
import {
  getPaymentStore,
  getRefundStore,
  getStore,
  nextReceiptNumber,
  nextRefundNumber,
  setPaymentStore,
  setRefundStore,
  setStore,
} from "@/lib/mock/billing_data";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function refundsForInvoice(invoiceId: string): Refund[] {
  const paymentIds = new Set(
    getPaymentStore().filter((p) => p.invoice_id === invoiceId).map((p) => p.id),
  );
  return getRefundStore().filter((r) => paymentIds.has(r.payment_id));
}

function syncInvoiceStatus(invoiceId: string): InvoiceWithItems {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === invoiceId);
  if (idx < 0) throw new Error("Invoice not found");

  const inv = store[idx];
  const payments = getPaymentStore().filter((p) => p.invoice_id === invoiceId);
  const refunds = refundsForInvoice(invoiceId);
  const balance = balanceDue(inv.net_amount, payments, refunds);
  const hasSuccessfulPayment = payments.some((p) => p.status === "success");
  const status = nextInvoiceStatusAfterPaymentActivity(
    inv.status,
    balance,
    hasSuccessfulPayment,
  );

  const next: InvoiceWithItems = {
    ...inv,
    status,
    payments,
    updated_at: new Date().toISOString(),
  };
  const copy = [...store];
  copy[idx] = next;
  setStore(copy);
  return next;
}

function attachPayments(inv: InvoiceWithItems): InvoiceWithItems {
  const payments = getPaymentStore().filter((p) => p.invoice_id === inv.id);
  return { ...inv, payments };
}

export async function listPayments(invoiceId: string): Promise<PaymentWithRefunds[]> {
  const payments = getPaymentStore().filter((p) => p.invoice_id === invoiceId);
  const refunds = getRefundStore();
  const rows = payments
    .map((p) => ({
      ...p,
      refunds: refunds.filter((r) => r.payment_id === p.id),
    }))
    .sort(
      (a, b) =>
        new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime(),
    );
  return delay(rows);
}

export async function getPayment(id: string): Promise<PaymentWithRefunds | null> {
  const payment = getPaymentStore().find((p) => p.id === id);
  if (!payment) return delay(null);
  const refunds = getRefundStore().filter((r) => r.payment_id === id);
  return delay({ ...payment, refunds });
}

export async function getInvoiceBalance(invoiceId: string): Promise<InvoiceBalance> {
  const inv = getStore().find((r) => r.id === invoiceId);
  if (!inv) throw new Error("Invoice not found");
  const payments = getPaymentStore().filter((p) => p.invoice_id === invoiceId);
  const refunds = refundsForInvoice(invoiceId);
  return delay({
    net_amount: inv.net_amount,
    paid_total: paidTotal(payments),
    refunded_total: refundedTotal(refunds),
    balance_due: balanceDue(inv.net_amount, payments, refunds),
  });
}

export async function collectPayment(
  invoiceId: string,
  body: CollectPaymentInput,
): Promise<{ payment: Payment; invoice: InvoiceWithItems }> {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === invoiceId);
  if (idx < 0) throw new Error("Invoice not found");

  const inv = store[idx];
  if (inv.status !== "issued" && inv.status !== "partially_paid") {
    throw new Error("Payments only allowed on issued or partially_paid invoices");
  }

  const payments = getPaymentStore().filter((p) => p.invoice_id === invoiceId);
  const refunds = refundsForInvoice(invoiceId);
  const due = fromMoney(balanceDue(inv.net_amount, payments, refunds));
  const amount = fromMoney(body.amount);
  if (amount <= 0) throw new Error("Amount must be greater than zero");
  if (amount > due + 0.001) throw new Error(`Amount exceeds balance due (${due})`);

  const paymentId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `50000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;

  const payment: Payment = {
    id: paymentId,
    invoice_id: invoiceId,
    receipt_number: nextReceiptNumber(),
    amount: toMoney(amount),
    currency: DEFAULT_CURRENCY,
    mode: body.mode,
    status: "success",
    collected_by: body.collected_by ?? MOCK_CASHIER_USER_ID,
    collected_at: new Date().toISOString(),
    sensitivity: "critical",
  };

  setPaymentStore([...getPaymentStore(), payment]);
  const invoice = attachPayments(syncInvoiceStatus(invoiceId));
  return delay({ payment, invoice });
}

export async function createRefund(
  paymentId: string,
  body: CreateRefundInput,
): Promise<{ refund: Refund; payment: PaymentWithRefunds; invoice: InvoiceWithItems }> {
  const payments = getPaymentStore();
  const pIdx = payments.findIndex((p) => p.id === paymentId);
  if (pIdx < 0) throw new Error("Payment not found");

  const payment = payments[pIdx];
  if (payment.status !== "success") {
    throw new Error("Only success payments can be reversed");
  }

  const existingRefunds = getRefundStore().filter((r) => r.payment_id === paymentId);
  const alreadyRefunded = fromMoney(refundedTotal(existingRefunds));
  const reversible = fromMoney(payment.amount) - alreadyRefunded;
  const amount = fromMoney(body.amount);
  if (amount <= 0) throw new Error("Refund amount must be greater than zero");
  if (amount > reversible + 0.001) {
    throw new Error(`Refund exceeds reversible amount (${reversible})`);
  }
  if (!body.reason.trim()) throw new Error("Reason is required");

  const refundId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `60000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;

  const refund: Refund = {
    id: refundId,
    payment_id: paymentId,
    refund_number: nextRefundNumber(),
    amount: toMoney(amount),
    reason: body.reason.trim(),
    approved_by: body.approved_by ?? MOCK_SUPERVISOR_USER_ID,
    refunded_at: new Date().toISOString(),
  };

  setRefundStore([...getRefundStore(), refund]);

  const newRefunded = alreadyRefunded + amount;
  let nextPayment = payment;
  if (newRefunded >= fromMoney(payment.amount) - 0.001) {
    nextPayment = { ...payment, status: "reversed" };
    const copy = [...payments];
    copy[pIdx] = nextPayment;
    setPaymentStore(copy);
  }

  const invoice = attachPayments(syncInvoiceStatus(payment.invoice_id));
  const allRefunds = getRefundStore().filter((r) => r.payment_id === paymentId);
  return delay({
    refund,
    payment: { ...nextPayment, refunds: allRefunds },
    invoice,
  });
}

/** Documents payment immutability — never succeeds. */
export async function attemptMutatePayment(): Promise<never> {
  await delay(null, 80);
  throw new Error("Immutable: payment financial fields cannot be updated");
}

/** Enrich invoice with payments (used by detail refresh). */
export function enrichInvoiceWithPayments(inv: InvoiceWithItems): InvoiceWithItems {
  return attachPayments(inv);
}
