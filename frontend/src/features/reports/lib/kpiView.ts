import type { KpiSnapshot } from "@/types/kpi";
import { kpiLabel } from "@/lib/kpi";
import { CORE_KPI_CODES } from "../constants";
import type { CoreKpiCode } from "../types";

/** Snapshots for one code, oldest → newest. */
export function rowsForCode(items: KpiSnapshot[], code: CoreKpiCode): KpiSnapshot[] {
  return items
    .filter((r) => r.kpi_code === code)
    .sort((a, b) => a.period_start.localeCompare(b.period_start));
}

/** Latest snapshot per core kpi_code in the loaded window. */
export function latestByCode(
  items: KpiSnapshot[],
): Partial<Record<CoreKpiCode, KpiSnapshot>> {
  const map: Partial<Record<CoreKpiCode, KpiSnapshot>> = {};
  for (const code of CORE_KPI_CODES) {
    const rows = rowsForCode(items, code);
    const last = rows[rows.length - 1];
    if (last) map[code] = last;
  }
  return map;
}

/** Delta of latest vs previous day in window (presentation only). */
export function deltaVsPrior(
  items: KpiSnapshot[],
  code: CoreKpiCode,
): { value: number; direction: "up" | "down" | "neutral" } | null {
  const rows = rowsForCode(items, code);
  if (rows.length < 2) return null;
  const latest = rows[rows.length - 1]!;
  const prior = rows[rows.length - 2]!;
  const diff = Number(latest.value) - Number(prior.value);
  if (Math.abs(diff) < 1e-9) return { value: 0, direction: "neutral" };
  return {
    value: Number(diff.toFixed(2)),
    direction: diff > 0 ? "up" : "down",
  };
}

export function periodWindowLabel(items: KpiSnapshot[]): string | null {
  if (items.length === 0) return null;
  const starts = items.map((r) => r.period_start).sort();
  const first = starts[0]!;
  const last = starts[starts.length - 1]!;
  return first === last ? first : `${first} → ${last}`;
}

export function formatPeriodShort(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export type ChartRow = {
  period_start: string;
} & Partial<Record<CoreKpiCode, number>>;

/** Pivot snapshots into Recharts rows keyed by period_start. */
export function pivotForChart(
  items: KpiSnapshot[],
  codes: readonly CoreKpiCode[] = CORE_KPI_CODES,
): ChartRow[] {
  const byDay = new Map<string, ChartRow>();
  for (const row of items) {
    if (!(codes as readonly string[]).includes(row.kpi_code)) continue;
    const code = row.kpi_code as CoreKpiCode;
    const existing = byDay.get(row.period_start) ?? { period_start: row.period_start };
    existing[code] = Number(row.value);
    byDay.set(row.period_start, existing);
  }
  return [...byDay.values()].sort((a, b) =>
    a.period_start.localeCompare(b.period_start),
  );
}

export function snapshotsToCsv(items: KpiSnapshot[]): string {
  const header = [
    "kpi_code",
    "label",
    "period_start",
    "period_end",
    "value",
    "numerator",
    "denominator",
    "facility_id",
  ];
  const lines = [header.join(",")];
  for (const r of items) {
    lines.push(
      [
        r.kpi_code,
        csvEscape(kpiLabel(r.kpi_code)),
        r.period_start,
        r.period_end,
        String(r.value),
        r.numerator ?? "",
        r.denominator ?? "",
        r.facility_id,
      ].join(","),
    );
  }
  return lines.join("\n");
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
