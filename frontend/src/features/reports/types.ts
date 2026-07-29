/**
 * Reports MIS types — kpi_snapshots (0025) + GET /reports/kpis?period=
 * Reuses shared KpiSnapshot; no invent catalog table.
 */

export type { KpiChartPoint, KpiSnapshot } from "@/types/kpi";

/** Documented example kpi_codes from schema. */
export type CoreKpiCode =
  | "avg_opd_wait_minutes"
  | "sharp_injury_count"
  | "bed_occupancy_pct";

/** UI / API period presets mapped to ?period= (not a DB enum). */
export type KpiPeriod = "today" | "7d" | "30d";

export type KpiListResponse = {
  items: import("@/types/kpi").KpiSnapshot[];
};
