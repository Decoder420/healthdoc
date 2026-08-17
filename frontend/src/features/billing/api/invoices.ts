import type {
  AddInvoiceItemInput,
  InvoiceListFilters,
  InvoiceWithItems,
  Paginated,
  UpdateInvoiceDraftInput,
} from "../types";
import { recomputeInvoiceTotals, withLineAmount } from "../lib/calculations";
import { toMoney, fromMoney } from "../lib/money";
import { getStore, getPaymentStore, setStore } from "@/lib/mock/billing_data";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function cloneInvoice(inv: InvoiceWithItems): InvoiceWithItems {
  return structuredClone(inv);
}

function newRowId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;
}

export async function listInvoices(
  filters: InvoiceListFilters = {},
): Promise<Paginated<InvoiceWithItems>> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "all";
  const page = filters.page ?? 1;
  const page_size = Math.min(filters.page_size ?? 20, 100);

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
        r.patient?.full_name,
        r.patient?.uhid,
        r.scheme_code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  const total = rows.length;
  const start = (page - 1) * page_size;
  const pageRows = rows.slice(start, start + page_size).map((r) => {
    const payments = getPaymentStore().filter((p) => p.invoice_id === r.id);
    return cloneInvoice({ ...r, payments });
  });

  return delay({ items: pageRows, page, page_size, total });
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  const found = getStore().find((r) => r.id === id);
  if (!found) return delay(null);
  const payments = getPaymentStore().filter((p) => p.invoice_id === id);
  return delay({ ...found, payments });
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

  const discount_amount =
    patch.discount_amount !== undefined
      ? toMoney(fromMoney(patch.discount_amount))
      : current.discount_amount;
  const scheme_adjustment =
    patch.scheme_adjustment !== undefined
      ? toMoney(fromMoney(patch.scheme_adjustment))
      : current.scheme_adjustment;

  const next: InvoiceWithItems = {
    ...current,
    scheme_code:
      patch.scheme_code !== undefined ? patch.scheme_code : current.scheme_code,
    discount_amount,
    scheme_adjustment,
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
    id: newRowId(),
    invoice_id: invoiceId,
    charge_category: body.charge_category,
    reference_type: body.reference_type ?? null,
    reference_id: body.reference_id ?? null,
    charge_master_id: body.charge_master_id ?? null,
    description: body.description,
    quantity: body.quantity,
    unit_price: toMoney(fromMoney(body.unit_price)),
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
  patch: Partial<
    Pick<AddInvoiceItemInput, "quantity" | "unit_price" | "description" | "charge_category">
  >,
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
      unit_price: toMoney(fromMoney(patch.unit_price ?? row.unit_price)),
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
