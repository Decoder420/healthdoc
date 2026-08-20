/**
 * Billing MIS — mirrors live BE (not kpi_snapshots):
 * GET /billing/mis/daily-revenue
 * GET /billing/mis/pending-invoices
 * GET /billing/mis/scheme-breakdown
 */

import { FACILITY_ID } from "../constants";
import { fromMoney, toMoney } from "../lib/money";
import {
  getPaymentStore,
  getRefundStore,
  getStore,
} from "@/lib/mock/billing_data";
import type {
  DailyRevenueResponse,
  MisDateRange,
  PendingInvoicesResponse,
  SchemeBreakdownResponse,
} from "../types";
import { balanceDue, paidTotal, refundedTotal } from "../lib/calculations";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function defaultRange(range: MisDateRange): { date_from: string; date_to: string } {
  const date_to = range.date_to ?? "2026-07-20";
  const date_from = range.date_from ?? "2026-07-14";
  return { date_from, date_to };
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export async function getDailyRevenue(
  range: MisDateRange = {},
): Promise<DailyRevenueResponse> {
  const { date_from, date_to } = defaultRange(range);
  const payments = getPaymentStore().filter((p) => {
    const d = dayKey(p.collected_at);
    return d >= date_from && d <= date_to && p.status === "success";
  });
  const refunds = getRefundStore().filter((r) => {
    const d = dayKey(r.refunded_at);
    return d >= date_from && d <= date_to;
  });

  const days = new Map<
    string,
    { payment_count: number; gross: number; refunded: number }
  >();

  for (const p of payments) {
    const d = dayKey(p.collected_at);
    const cur = days.get(d) ?? { payment_count: 0, gross: 0, refunded: 0 };
    cur.payment_count += 1;
    cur.gross += fromMoney(p.amount);
    days.set(d, cur);
  }
  for (const r of refunds) {
    const d = dayKey(r.refunded_at);
    const cur = days.get(d) ?? { payment_count: 0, gross: 0, refunded: 0 };
    cur.refunded += fromMoney(r.amount);
    days.set(d, cur);
  }

  const points = [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({
      day,
      payment_count: v.payment_count,
      gross_collected: toMoney(v.gross),
      refunded: toMoney(v.refunded),
      net_revenue: toMoney(v.gross - v.refunded),
    }));

  const total_net_revenue = toMoney(
    points.reduce((s, p) => s + fromMoney(p.net_revenue), 0),
  );

  return delay({
    facility_id: FACILITY_ID,
    date_from,
    date_to,
    points,
    total_net_revenue,
  });
}

export async function getPendingInvoices(): Promise<PendingInvoicesResponse> {
  const as_of = new Date().toISOString();
  const payments = getPaymentStore();
  const refunds = getRefundStore();

  const items = getStore()
    .filter((inv) => inv.status === "issued" || inv.status === "partially_paid")
    .map((inv) => {
      const invPayments = payments.filter((p) => p.invoice_id === inv.id);
      const paymentIds = new Set(invPayments.map((p) => p.id));
      const invRefunds = refunds.filter((r) => paymentIds.has(r.payment_id));
      const paid_amount = paidTotal(invPayments);
      const balance_due = balanceDue(inv.net_amount, invPayments, invRefunds);
      const days_pending = Math.max(
        0,
        Math.floor(
          (Date.parse(as_of) - Date.parse(inv.created_at)) / (24 * 60 * 60 * 1000),
        ),
      );
      return {
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
        visit_id: inv.visit_id,
        patient_id: inv.patient_id,
        status: inv.status,
        net_amount: inv.net_amount,
        paid_amount,
        balance_due,
        created_at: inv.created_at,
        days_pending,
      };
    })
    .filter((row) => fromMoney(row.balance_due) > 0.001);

  const total_balance_due = toMoney(
    items.reduce((s, r) => s + fromMoney(r.balance_due), 0),
  );

  return delay({
    facility_id: FACILITY_ID,
    as_of,
    count: items.length,
    total_balance_due,
    items,
  });
}

export async function getSchemeBreakdown(
  range: MisDateRange = {},
): Promise<SchemeBreakdownResponse> {
  const { date_from, date_to } = defaultRange(range);
  const payments = getPaymentStore();
  const refunds = getRefundStore();

  const invoices = getStore().filter((inv) => {
    const d = dayKey(inv.created_at);
    return d >= date_from && d <= date_to;
  });

  const map = new Map<
    string,
    {
      invoice_count: number;
      net_billed: number;
      scheme_adjustment_total: number;
      collected_total: number;
    }
  >();

  for (const inv of invoices) {
    const key = inv.scheme_code ?? "self_pay";
    const cur = map.get(key) ?? {
      invoice_count: 0,
      net_billed: 0,
      scheme_adjustment_total: 0,
      collected_total: 0,
    };
    cur.invoice_count += 1;
    cur.net_billed += fromMoney(inv.net_amount);
    cur.scheme_adjustment_total += fromMoney(inv.scheme_adjustment);

    const invPayments = payments.filter((p) => p.invoice_id === inv.id);
    const paymentIds = new Set(invPayments.map((p) => p.id));
    const invRefunds = refunds.filter((r) => paymentIds.has(r.payment_id));
    cur.collected_total +=
      fromMoney(paidTotal(invPayments)) - fromMoney(refundedTotal(invRefunds));
    map.set(key, cur);
  }

  const lines = [...map.entries()].map(([scheme_code, v]) => ({
    scheme_code,
    invoice_count: v.invoice_count,
    net_billed: toMoney(v.net_billed),
    scheme_adjustment_total: toMoney(v.scheme_adjustment_total),
    collected_total: toMoney(v.collected_total),
  }));

  const grand_total_net_billed = toMoney(
    lines.reduce((s, l) => s + fromMoney(l.net_billed), 0),
  );

  return delay({
    facility_id: FACILITY_ID,
    date_from,
    date_to,
    lines,
    grand_total_net_billed,
  });
}
