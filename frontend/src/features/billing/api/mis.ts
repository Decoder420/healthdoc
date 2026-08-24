/**
 * Billing MIS. Retired from fixtures (P1.1).
 *
 * All three read live rather than from kpi_snapshots, and all three are
 * facility-scoped server-side from the token — no facility is sent.
 *
 * Dates are the FACILITY's business dates (facilities.timezone), not UTC and
 * not the server's. A hospital in a different timezone closing its day at
 * midnight local is the whole reason `service._facility_business_date` exists.
 */
import { api } from "@/lib/api";
import type {
  DailyRevenueResponse,
  PendingInvoicesResponse,
  SchemeBreakdownResponse,
} from "../types";

/** GET /billing/mis/daily-revenue — gross collected, refunded, net, per day. */
export interface MisDateRange {
  date_from?: string;
  date_to?: string;
}

export function getDailyRevenue(range: MisDateRange = {}): Promise<DailyRevenueResponse> {
  const params = new URLSearchParams();
  if (range.date_from) params.set("date_from", range.date_from);
  if (range.date_to) params.set("date_to", range.date_to);
  // Query string appended unconditionally rather than via a nested ternary
  // template: check_frontend_contracts parses these paths statically, and a
  // `${qs ? `?${qs}` : ""}` inside the template yields a malformed path it
  // cannot match against OpenAPI. An empty ?  is harmless.
  return api<DailyRevenueResponse>(`/billing/mis/daily-revenue?${params.toString()}`);
}

/**
 * GET /billing/mis/pending-invoices — what is owed, with days outstanding.
 *
 * `days_pending` is computed from the facility's business date, so an invoice
 * raised late on the 1st is one day old on the 2nd regardless of UTC offset.
 */
export function getPendingInvoices(): Promise<PendingInvoicesResponse> {
  return api<PendingInvoicesResponse>("/billing/mis/pending-invoices");
}

/** GET /billing/mis/scheme-breakdown — self_pay vs PM-JAY vs other. */
export function getSchemeBreakdown(range: MisDateRange = {}): Promise<SchemeBreakdownResponse> {
  const params = new URLSearchParams();
  if (range.date_from) params.set("date_from", range.date_from);
  if (range.date_to) params.set("date_to", range.date_to);
  return api<SchemeBreakdownResponse>(`/billing/mis/scheme-breakdown?${params.toString()}`);
}
