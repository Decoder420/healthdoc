import type {
  CollectPaymentInput,
  CreateRefundInput,
  InvoiceWithItems,
  Payment,
  PaymentWithRefunds,
  Refund,
} from "../types";
import {
  balanceDue,
  nextInvoiceStatusAfterPaymentActivity,
  paidTotal,
  round2,
} from "../lib/calculations";
import {
  getPaymentStore,
  getRefundStore,
  getStore,
  nextReceiptNumber,
  nextRefundNumber,
  setPaymentStore,
  setRefundStore,
  setStore,
} from "../lib/mock/billing_data";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function syncInvoiceStatus(invoiceId: string): InvoiceWithItems {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === invoiceId);
  if (idx < 0) throw new Error("Invoice not found");

  const inv = store[idx];
  const payments = getPaymentStore().filter((p) => p.invoice_id === invoiceId);
  const refunds = getRefundStore().filter((r) => r.invoice_id === invoiceId);
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

export async function getInvoiceBalance(invoiceId: string): Promise<{
  net_amount: number;
  paid_total: number;
  refunded_total: number;
  balance_due: number;
}> {
  const inv = getStore().find((r) => r.id === invoiceId);
  if (!inv) throw new Error("Invoice not found");
  const payments = getPaymentStore().filter((p) => p.invoice_id === invoiceId);
  const refunds = getRefundStore().filter((r) => r.invoice_id === invoiceId);
  const paid_total = paidTotal(payments);
  const balance_due = balanceDue(inv.net_amount, payments, refunds);
  const refunded_total = round2(refunds.reduce((s, r) => s + r.amount, 0));
  return delay({
    net_amount: inv.net_amount,
    paid_total,
    refunded_total,
    balance_due,
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
  const refunds = getRefundStore().filter((r) => r.invoice_id === invoiceId);
  const due = balanceDue(inv.net_amount, payments, refunds);
  const amount = round2(body.amount);
  if (amount <= 0) throw new Error("Amount must be greater than zero");
  if (amount > due + 0.001) throw new Error(`Amount exceeds balance due (${due})`);

  const payment: Payment = {
    id: `pay-${crypto.randomUUID().slice(0, 8)}`,
    invoice_id: invoiceId,
    receipt_number: nextReceiptNumber(),
    amount,
    mode: body.mode,
    status: "success",
    collected_by: body.collected_by ?? "cashier.dev",
    collected_at: new Date().toISOString(),
    reference_txn_id: body.reference_txn_id ?? null,
    notes: body.notes ?? null,
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
  const alreadyRefunded = round2(existingRefunds.reduce((s, r) => s + r.amount, 0));
  const reversible = round2(payment.amount - alreadyRefunded);
  const amount = round2(body.amount);
  if (amount <= 0) throw new Error("Refund amount must be greater than zero");
  if (amount > reversible + 0.001) {
    throw new Error(`Refund exceeds reversible amount (${reversible})`);
  }
  if (!body.reason.trim()) throw new Error("Reason is required");

  const refund: Refund = {
    id: `rfd-${crypto.randomUUID().slice(0, 8)}`,
    payment_id: paymentId,
    invoice_id: payment.invoice_id,
    refund_number: nextRefundNumber(),
    amount,
    reason: body.reason.trim(),
    approved_by: body.approved_by ?? "supervisor.dev",
    refunded_at: new Date().toISOString(),
  };

  setRefundStore([...getRefundStore(), refund]);

  const newRefunded = round2(alreadyRefunded + amount);
  let nextPayment = payment;
  if (newRefunded >= payment.amount - 0.001) {
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
