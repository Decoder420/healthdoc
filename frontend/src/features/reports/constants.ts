import type { CoreKpiCode, KpiPeriod } from "./types";

/** Same facility as admin mock seed. */
export const FACILITY_ID = "fac-0001";

/**
 * Exactly the three documented kpi_code examples from kpi_snapshots / schema.
 * Tile order for MIS dashboard.
 */
export const CORE_KPI_CODES: readonly CoreKpiCode[] = [
  "avg_opd_wait_minutes",
  "sharp_injury_count",
  "bed_occupancy_pct",
] as const;

export const PERIOD_OPTIONS: readonly {
  value: KpiPeriod;
  label: string;
}[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
] as const;

/** Chart series colors (Meridian-aligned, not schema). */
export const KPI_SERIES_COLORS: Record<CoreKpiCode, string> = {
  avg_opd_wait_minutes: "#001f54",
  sharp_injury_count: "#b45309",
  bed_occupancy_pct: "#0f766e",
};
