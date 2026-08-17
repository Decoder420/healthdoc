/**
 * Reports MIS types.
 * - kpi_snapshots shape for future GET /reports/kpis?period= (schema; BE stub today)
 * - Billing finance MIS: see @/features/billing types DailyRevenue* / Pending* / Scheme*
 */

export type { KpiChartPoint, KpiSnapshot } from "@/types/kpi";

/** Documented example kpi_codes from schema kpi_snapshots. */
export type CoreKpiCode =
  | "avg_opd_wait_minutes"
  | "sharp_injury_count";

/** UI / API period presets mapped to ?period= (not a DB enum). */
export type KpiPeriod = "today" | "7d" | "30d";

export type KpiListResponse = {
  items: import("@/types/kpi").KpiSnapshot[];
};
