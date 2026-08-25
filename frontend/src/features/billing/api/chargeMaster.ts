/**
 * Charge master — the effective-dated tariff catalogue (0033).
 * Retired from fixtures (P1.1).
 *
 * `resolveTariff` was REMOVED rather than wired. Pricing is resolved
 * server-side inside `build_invoice`, against the tariff that was effective on
 * the visit's business date. A browser-side resolver would price from today's
 * catalogue, so re-opening a month-old visit would show a different figure than
 * the invoice actually carries — and the invoice is right.
 *
 * The preview endpoint is the honest way to ask "what would this cost": it
 * returns each prospective line with `priced: true|false` and a
 * `pricing_note` when no tariff was found.
 */
import { api } from "@/lib/api";
import type { ChargeMaster } from "../types";

export interface ChargeMasterListFilters {
  /** Effective-dated rows only. Applied client-side — see below. */
  active_only?: boolean;
  scheme_code?: string | "all";
}

/**
 * GET /billing/charge-master — the facility's tariff rows.
 *
 * The endpoint takes no filters. `active_only` and `scheme_code` narrow the
 * fetched list here, which is safe because the response is not paginated: the
 * catalogue is per-facility and small, so this filters the whole set rather
 * than one page of it. That is the difference between this and the paginated
 * searches elsewhere, where client-side filtering silently hides matches.
 */
export async function listChargeMaster(
  filters: ChargeMasterListFilters = {},
): Promise<ChargeMaster[]> {
  const response = await api<{ items: ChargeMaster[] }>("/billing/charge-master");
  let rows = response.items;
  if (filters.active_only) rows = rows.filter((r) => r.is_active !== false);
  if (filters.scheme_code && filters.scheme_code !== "all") {
    rows = rows.filter((r) => r.scheme_code === filters.scheme_code);
  }
  return rows;
}

/**
 * One tariff row.
 *
 * Narrowed from the list — there is no by-id endpoint, and the catalogue is
 * small enough per facility that a second round trip would buy nothing.
 */
export async function getChargeMaster(tariffId: string): Promise<ChargeMaster | null> {
  const rows = await listChargeMaster();
  return rows.find((row) => row.id === tariffId) ?? null;
}
