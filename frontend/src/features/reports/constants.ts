import type { ModuleCode } from "@/features/admin/types";
import type { CoreKpiCode, KpiPeriod } from "./types";

import { MOCK_FACILITY_ID } from "@/lib/mock/facility";

/** Same facility as admin / billing mock seed. */
export const FACILITY_ID = MOCK_FACILITY_ID;

/**
 * Exactly the documented kpi_code examples from kpi_snapshots / schema.
 * Tile order for MIS dashboard. Both are core (always-on).
 */
export const CORE_KPI_CODES: readonly CoreKpiCode[] = [
  "avg_opd_wait_minutes",
  "sharp_injury_count",
] as const;

/**
 * Optional ModuleCode required to show a KPI tile.
 * Empty for current core pair; extend when lab/pharmacy KPIs are added.
 */
export const KPI_MODULE_GATES: Partial<Record<CoreKpiCode, ModuleCode>> = {};

export const PERIOD_OPTIONS: readonly {
  value: KpiPeriod;
  label: string;
}[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "custom", label: "Custom" },
] as const;

/** Chart series colors (Meridian-aligned, not schema). */
export const KPI_SERIES_COLORS: Record<CoreKpiCode, string> = {
  avg_opd_wait_minutes: "#001f54",
  sharp_injury_count: "#b45309",
};
