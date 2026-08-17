/**
 * Visit-scoped invoice accrual — mirrors BE:
 * GET  /billing/visits/{visit_id}/invoice/preview
 * POST /billing/visits/{visit_id}/invoice/build
 * GET  /billing/visits/{visit_id}/pmjay-eligibility
 */

import { fromMoney, toMoney } from "../lib/money";
import { withLineAmount } from "../lib/calculations";
import { lookupChargeMaster } from "@/lib/mock/charge_master_data";
import {
  getStore,
  setStore,
} from "@/lib/mock/billing_data";
import { FACILITY_CODE, FACILITY_ID } from "../constants";
import type {
  ChargeLine,
  InvoiceBuildRequest,
  InvoiceBuildResponse,
  InvoicePreviewResponse,
  InvoiceWithItems,
  PMJAYEligibilityResponse,
} from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function newRowId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;
}

/** Pending clinical charges not yet on the visit invoice (mock seed). */
const PENDING_BY_VISIT: Record<
  string,
  Array<{
    charge_code: string;
    charge_category: ChargeLine["charge_category"];
    reference_type: string;
    reference_id: string;
    description: string;
    quantity?: number;
  }>
> = {
  "20000000-0000-4000-8000-000000000001": [
    {
      charge_code: "LAB-CBC",
      charge_category: "lab",
      reference_type: "lab_order_items",
      reference_id: "40000000-0000-4000-8000-000000000902",
      description: "Complete Blood Count (CBC) — recheck",
    },
  ],
  "20000000-0000-4000-8000-000000000004": [
    {
      charge_code: "LAB-CBC",
      charge_category: "lab",
      reference_type: "lab_order_items",
      reference_id: "40000000-0000-4000-8000-000000000910",
      description: "Complete Blood Count (CBC)",
    },
    {
      charge_code: "UNPRICED-XYZ",
      charge_category: "other",
      reference_type: "orders",
      reference_id: "40000000-0000-4000-8000-000000000999",
      description: "Unmapped procedure (no tariff)",
    },
  ],
};

function billedKeys(inv: InvoiceWithItems | undefined): Set<string> {
  const keys = new Set<string>();
  if (!inv) return keys;
  for (const it of inv.items) {
    if (it.reference_type && it.reference_id) {
      keys.add(`${it.reference_type}:${it.reference_id}`);
    }
  }
  return keys;
}

function buildChargeLines(
  visitId: string,
  scheme_code: string | null,
): { lines: ChargeLine[]; invoice: InvoiceWithItems | undefined } {
  const invoice = getStore().find((r) => r.visit_id === visitId);
  const pending = PENDING_BY_VISIT[visitId] ?? [];
  const already = billedKeys(invoice);
  const lines: ChargeLine[] = [];

  for (const p of pending) {
    const key = `${p.reference_type}:${p.reference_id}`;
    if (already.has(key)) continue;

    const tariff = lookupChargeMaster(p.charge_code, scheme_code);
    const qty = p.quantity ?? 1;
    if (!tariff) {
      lines.push({
        charge_category: p.charge_category,
        reference_type: p.reference_type,
        reference_id: p.reference_id,
        description: p.description,
        quantity: qty,
        unit_price: toMoney(0),
        amount: toMoney(0),
        priced: false,
        pricing_note: "no_tariff",
        charge_master_id: null,
      });
      continue;
    }
    const unit = fromMoney(tariff.unit_price);
    lines.push({
      charge_category: tariff.charge_category,
      reference_type: p.reference_type,
      reference_id: p.reference_id,
      description: tariff.description,
      quantity: qty,
      unit_price: tariff.unit_price,
      amount: toMoney(unit * qty),
      priced: true,
      pricing_note: null,
      charge_master_id: tariff.id,
    });
  }

  return { lines, invoice };
}

/** GET /billing/visits/{visit_id}/invoice/preview */
export async function previewVisitInvoice(
  visitId: string,
): Promise<InvoicePreviewResponse> {
  const existing = getStore().find((r) => r.visit_id === visitId);
  const { lines, invoice } = buildChargeLines(
    visitId,
    existing?.scheme_code ?? null,
  );
  const priced = lines.filter((l) => l.priced);
  const newTotal = priced.reduce((s, l) => s + fromMoney(l.amount), 0);
  const existingGross = invoice ? fromMoney(invoice.gross_amount) : 0;

  return delay({
    visit_id: visitId,
    patient_id: invoice?.patient_id ?? null,
    invoice_id: invoice?.id ?? null,
    invoice_status: invoice?.status ?? null,
    already_billed_count: invoice?.items.length ?? 0,
    new_charge_lines: lines,
    unpriced_count: lines.filter((l) => !l.priced).length,
    projected_new_charges_total: toMoney(newTotal),
    projected_gross_amount: toMoney(existingGross + newTotal),
  });
}

/** POST /billing/visits/{visit_id}/invoice/build */
export async function buildVisitInvoice(
  visitId: string,
  body: InvoiceBuildRequest = {},
): Promise<InvoiceBuildResponse> {
  if (body.dry_run) {
    const preview = await previewVisitInvoice(visitId);
    return delay({
      visit_id: visitId,
      invoice_id: preview.invoice_id ?? "dry-run",
      invoice_number: "DRY-RUN",
      status: preview.invoice_status ?? "draft",
      lines_added: preview.new_charge_lines.filter((l) => l.priced).length,
      lines_skipped_unpriced: preview.unpriced_count,
      gross_amount: preview.projected_gross_amount,
      net_amount: preview.projected_gross_amount,
    });
  }

  const store = getStore();
  let idx = store.findIndex((r) => r.visit_id === visitId);
  let invoice = idx >= 0 ? store[idx] : undefined;
  const { lines } = buildChargeLines(visitId, invoice?.scheme_code ?? null);
  const priced = lines.filter((l) => l.priced);
  const skipped = lines.filter((l) => !l.priced).length;

  if (!invoice) {
    const id = newRowId();
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const now = new Date().toISOString();
    invoice = {
      id,
      invoice_number: `INV-${FACILITY_CODE}-${day}-BUILD`,
      visit_id: visitId,
      patient_id: "30000000-0000-4000-8000-000000000099",
      facility_id: FACILITY_ID,
      status: "draft",
      discount_amount: toMoney(0),
      scheme_adjustment: toMoney(0),
      gross_amount: toMoney(0),
      net_amount: toMoney(0),
      scheme_code: null,
      sensitivity: "critical",
      created_at: now,
      updated_at: now,
      items: [],
    };
    store.push(invoice);
    idx = store.length - 1;
  }

  if (invoice.status !== "draft") {
    throw new Error("Cannot build lines onto a non-draft invoice");
  }

  const newItems = priced.map((line) =>
    withLineAmount({
      id: newRowId(),
      invoice_id: invoice!.id,
      charge_category: line.charge_category,
      reference_type: line.reference_type,
      reference_id: line.reference_id,
      charge_master_id: line.charge_master_id ?? null,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unit_price,
    }),
  );

  const items = [...invoice.items, ...newItems];
  const gross = items.reduce((s, it) => s + fromMoney(it.amount), 0);
  const discount = fromMoney(invoice.discount_amount);
  const schemeAdj = fromMoney(invoice.scheme_adjustment);
  const next: InvoiceWithItems = {
    ...invoice,
    items,
    gross_amount: toMoney(gross),
    net_amount: toMoney(Math.max(0, gross - discount - schemeAdj)),
    updated_at: new Date().toISOString(),
  };

  const copy = [...store];
  copy[idx] = next;
  setStore(copy);

  return delay({
    visit_id: visitId,
    invoice_id: next.id,
    invoice_number: next.invoice_number,
    status: next.status,
    lines_added: priced.length,
    lines_skipped_unpriced: skipped,
    gross_amount: next.gross_amount,
    net_amount: next.net_amount,
  });
}

/** GET /billing/visits/{visit_id}/pmjay-eligibility — BE stub */
export async function getPmjayEligibility(
  visitId: string,
  patientId: string,
): Promise<PMJAYEligibilityResponse> {
  return delay({
    patient_id: patientId,
    visit_id: visitId,
    scheme_code: "PM-JAY",
    eligibility_status: "not_determined",
    reason: "Stub — not a live ABDM check",
    is_stub: true,
  });
}
