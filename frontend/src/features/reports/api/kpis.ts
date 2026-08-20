import { filterKpisByPeriod } from "@/lib/mock/reports_data";
import type { KpiListResponse, KpiPeriod } from "../types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(value)), ms),
  );
}

/**
 * Mirrors documented GET /reports/kpis?period=
 * items[]: {kpi_code, period_start, period_end, value, numerator, denominator}
 * Swap to lib/api.ts when BE exists.
 */
export async function listKpis(
  period: KpiPeriod,
  from?: string,
  to?: string,
): Promise<KpiListResponse> {
  const items = filterKpisByPeriod(period, from, to);
  return delay({ items });
}
