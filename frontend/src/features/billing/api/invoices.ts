import type {
  AddInvoiceItemInput,
  InvoiceListFilters,
  InvoiceWithItems,
  PmjayEligibilityStatus,
  UpdateInvoiceDraftInput,
} from "../types";
import { recomputeInvoiceTotals, withLineAmount } from "../lib/calculations";
import {
  getStore,
  getPaymentStore,
  PMJAY_ELIGIBILITY,
  setStore,
} from "../lib/mock/billing_data";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function cloneInvoice(inv: InvoiceWithItems): InvoiceWithItems {
  return structuredClone(inv);
}

export async function listInvoices(
  filters: InvoiceListFilters = {},
): Promise<InvoiceWithItems[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "all";

  let rows = getStore();
  if (status !== "all") {
    rows = rows.filter((r) => r.status === status);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [
        r.invoice_number,
        r.visit_id,
        r.patient_id,
        r.patient?.name,
        r.patient?.uhid,
        r.scheme_code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  return delay(
    rows.map((r) => {
      const payments = getPaymentStore().filter((p) => p.invoice_id === r.id);
      return cloneInvoice({ ...r, payments });
    }),
  );
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  const found = getStore().find((r) => r.id === id);
  if (!found) return delay(null);
  const payments = getPaymentStore().filter((p) => p.invoice_id === id);
  return delay({ ...found, payments });
}

export async function getPmjayEligibility(
  uhid: string,
): Promise<PmjayEligibilityStatus> {
  return delay(PMJAY_ELIGIBILITY[uhid] ?? "unknown");
}

export async function updateInvoiceDraft(
  id: string,
  patch: UpdateInvoiceDraftInput,
): Promise<InvoiceWithItems> {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Invoice not found");

  const current = store[idx];
  if (current.status !== "draft" && patch.status === undefined) {
    throw new Error("Invoice is frozen — only draft invoices can be edited");
  }

  const next: InvoiceWithItems = {
    ...current,
    ...patch,
    scheme_code:
      patch.scheme_code !== undefined ? patch.scheme_code : current.scheme_code,
    discount_amount:
      patch.discount_amount !== undefined
        ? patch.discount_amount
        : current.discount_amount,
    scheme_adjustment:
      patch.scheme_adjustment !== undefined
        ? patch.scheme_adjustment
        : current.scheme_adjustment,
    status: patch.status ?? current.status,
    updated_at: new Date().toISOString(),
  };

  const totals = recomputeInvoiceTotals(
    next.items,
    next.discount_amount,
    next.scheme_adjustment,
  );
  next.gross_amount = totals.gross_amount;
  next.net_amount = totals.net_amount;

  const copy = [...store];
  copy[idx] = next;
  setStore(copy);
  return delay(cloneInvoice(next));
}

export async function addInvoiceItem(
  invoiceId: string,
  body: AddInvoiceItemInput,
): Promise<InvoiceWithItems> {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === invoiceId);
  if (idx < 0) throw new Error("Invoice not found");
  if (store[idx].status !== "draft") {
    throw new Error("Cannot add items to a non-draft invoice");
  }

  const item = withLineAmount({
    id: `item-${crypto.randomUUID().slice(0, 8)}`,
    invoice_id: invoiceId,
    charge_category: body.charge_category,
    reference_type: body.reference_type ?? null,
    reference_id: body.reference_id ?? null,
    description: body.description,
    quantity: body.quantity,
    unit_price: body.unit_price,
    amount: 0,
  });

  const current = store[idx];
  const items = [...current.items, item];
  const totals = recomputeInvoiceTotals(
    items,
    current.discount_amount,
    current.scheme_adjustment,
  );

  const next: InvoiceWithItems = {
    ...current,
    items,
    ...totals,
    updated_at: new Date().toISOString(),
  };

  const copy = [...store];
  copy[idx] = next;
  setStore(copy);
  return delay(cloneInvoice(next));
}

export async function updateInvoiceItem(
  invoiceId: string,
  itemId: string,
  patch: Partial<Pick<AddInvoiceItemInput, "quantity" | "unit_price" | "description" | "charge_category">>,
): Promise<InvoiceWithItems> {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === invoiceId);
  if (idx < 0) throw new Error("Invoice not found");
  if (store[idx].status !== "draft") {
    throw new Error("Cannot edit items on a non-draft invoice");
  }

  const current = store[idx];
  const items = current.items.map((row) => {
    if (row.id !== itemId) return row;
    return withLineAmount({
      ...row,
      ...patch,
      quantity: patch.quantity ?? row.quantity,
      unit_price: patch.unit_price ?? row.unit_price,
    });
  });

  const totals = recomputeInvoiceTotals(
    items,
    current.discount_amount,
    current.scheme_adjustment,
  );

  const next: InvoiceWithItems = {
    ...current,
    items,
    ...totals,
    updated_at: new Date().toISOString(),
  };

  const copy = [...store];
  copy[idx] = next;
  setStore(copy);
  return delay(cloneInvoice(next));
}

export async function removeInvoiceItem(
  invoiceId: string,
  itemId: string,
): Promise<InvoiceWithItems> {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === invoiceId);
  if (idx < 0) throw new Error("Invoice not found");
  if (store[idx].status !== "draft") {
    throw new Error("Cannot remove items from a non-draft invoice");
  }

  const current = store[idx];
  const target = current.items.find((i) => i.id === itemId);
  if (!target) throw new Error("Item not found");

  const registrationCount = current.items.filter(
    (i) => i.charge_category === "registration",
  ).length;
  if (target.charge_category === "registration" && registrationCount <= 1) {
    throw new Error("Cannot remove the last registration line");
  }

  const items = current.items.filter((i) => i.id !== itemId);
  const totals = recomputeInvoiceTotals(
    items,
    current.discount_amount,
    current.scheme_adjustment,
  );

  const next: InvoiceWithItems = {
    ...current,
    items,
    ...totals,
    updated_at: new Date().toISOString(),
  };

  const copy = [...store];
  copy[idx] = next;
  setStore(copy);
  return delay(cloneInvoice(next));
}

export async function issueInvoice(id: string): Promise<InvoiceWithItems> {
  return updateInvoiceDraft(id, { status: "issued" });
}
