import type { KpiSnapshot } from "@/types/kpi";
import {
  CORE_KPI_CODES,
  FACILITY_ID,
} from "@/features/reports/constants";
import type { CoreKpiCode, KpiPeriod } from "@/features/reports/types";

/** Anchor "today" for deterministic mock windows (matches admin seed era). */
export const MOCK_TODAY = "2026-07-20";

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function baseValue(code: CoreKpiCode, dayIndex: number): number {
  switch (code) {
    case "avg_opd_wait_minutes":
      return 18 + (dayIndex % 7) * 1.4 + (dayIndex % 3) * 0.5;
    case "sharp_injury_count":
      return dayIndex % 5 === 0 ? 1 : dayIndex % 11 === 0 ? 2 : 0;
    case "bed_occupancy_pct":
      return 62 + (dayIndex % 9) * 2.1 + (dayIndex % 4);
    default:
      return 0;
  }
}

function buildSnapshots(): KpiSnapshot[] {
  const rows: KpiSnapshot[] = [];
  // 30 days ending MOCK_TODAY (inclusive)
  for (let i = 29; i >= 0; i -= 1) {
    const day = addDays(MOCK_TODAY, -i);
    const dayIndex = 29 - i;
    for (const kpi_code of CORE_KPI_CODES) {
      const value = Number(baseValue(kpi_code, dayIndex).toFixed(4));
      let numerator: number | null = null;
      let denominator: number | null = null;
      if (kpi_code === "bed_occupancy_pct") {
        denominator = 120;
        numerator = Math.round((value / 100) * denominator);
      } else if (kpi_code === "avg_opd_wait_minutes") {
        denominator = 40 + (dayIndex % 10);
        numerator = Number((value * denominator).toFixed(2));
      } else {
        numerator = value;
        denominator = null;
      }
      rows.push({
        facility_id: FACILITY_ID,
        kpi_code,
        period_start: day,
        period_end: day,
        value,
        numerator,
        denominator,
      });
    }
  }
  return rows;
}

let snapshots: KpiSnapshot[] = buildSnapshots();

export function getKpiSnapshots(): KpiSnapshot[] {
  return snapshots;
}

export function setKpiSnapshots(next: KpiSnapshot[]): void {
  snapshots = next;
}

function periodStartBound(period: KpiPeriod): string {
  switch (period) {
    case "today":
      return MOCK_TODAY;
    case "7d":
      return addDays(MOCK_TODAY, -6);
    case "30d":
      return addDays(MOCK_TODAY, -29);
    default:
      return MOCK_TODAY;
  }
}

/** Filter kpi_snapshots by period window (period_start within [bound, MOCK_TODAY]). */
export function filterKpisByPeriod(period: KpiPeriod): KpiSnapshot[] {
  const start = periodStartBound(period);
  return snapshots.filter(
    (row) =>
      row.facility_id === FACILITY_ID &&
      row.period_start >= start &&
      row.period_start <= MOCK_TODAY &&
      (CORE_KPI_CODES as readonly string[]).includes(row.kpi_code),
  );
}
