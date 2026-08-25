/**
 * Visit-level invoice operations. Retired from fixtures (P1.1).
 *
 * This is where an invoice actually gets its lines: `build` aggregates unbilled
 * charges from lab, radiology and pharmacy onto the visit's draft. Nothing is
 * typed by hand — see api/invoices.ts for why manual line editing was removed
 * rather than left unimplemented.
 */
import { api } from "@/lib/api";
import type {
  InvoiceBuildRequest,
  InvoiceBuildResponse,
  InvoicePreviewResponse,
  PMJAYEligibilityResponse,
} from "../types";

/**
 * GET /billing/visits/{id}/invoice/preview — read-only, writes nothing.
 *
 * Shows what `build` would add, including lines it would SKIP for want of a
 * tariff (`priced: false`). Those are the ones worth looking at: an unpriced
 * charge is revenue the hospital performed and cannot bill.
 */
export function previewVisitInvoice(visitId: string): Promise<InvoicePreviewResponse> {
  return api<InvoicePreviewResponse>(`/billing/visits/${visitId}/invoice/preview`);
}

/**
 * POST /billing/visits/{id}/invoice/build — aggregates unbilled charges.
 *
 * Safe to run repeatedly: `_already_billed_reference_ids` skips anything
 * already on the invoice, so a second build after more work is done adds only
 * the new charges rather than duplicating the old ones.
 *
 * `dry_run: true` behaves like preview and writes nothing.
 */
export function buildVisitInvoice(
  visitId: string,
  body: InvoiceBuildRequest = { dry_run: false },
): Promise<InvoiceBuildResponse> {
  return api<InvoiceBuildResponse>(`/billing/visits/${visitId}/invoice/build`, {
    method: "POST",
    body: JSON.stringify(body),
    // Not idempotency-keyed: the accrual guard above is what makes a repeat
    // safe, and it is a stronger guarantee than a replayed response.
    idempotencyKey: null,
  });
}

/**
 * GET /billing/visits/{id}/pmjay-eligibility.
 *
 * A STUB server-side (`is_stub: true` on the response) — it gates front-desk
 * document collection and is not a billing guarantee. Render that flag; a
 * scheme decision presented as settled when it is a placeholder is how a
 * patient gets told the wrong thing about what they owe.
 */
export function getPmjayEligibility(
  visitId: string,
  patientId: string,
): Promise<PMJAYEligibilityResponse> {
  const params = new URLSearchParams({ patient_id: patientId });
  return api<PMJAYEligibilityResponse>(
    `/billing/visits/${visitId}/pmjay-eligibility?${params.toString()}`,
  );
}
