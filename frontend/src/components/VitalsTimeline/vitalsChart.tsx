"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { meridian } from "@/styles/theme";
import type { VitalRecord } from "./VitalsTimeline.types";

export type VitalsChartProps = {
  records: VitalRecord[];
};

type ChartPoint = {
  recordedAt: string;
  pulse: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  temperature: number;
  bpSystolic: number | null;
  bpDiastolic: number | null;
};

function formatTick(recordedAt: string): string {
  const date = new Date(recordedAt);
  if (Number.isNaN(date.getTime())) return recordedAt;
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function parseBp(bloodPressure: string): {
  systolic: number | null;
  diastolic: number | null;
} {
  const match = bloodPressure.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { systolic: null, diastolic: null };
  return {
    systolic: Number(match[1]),
    diastolic: Number(match[2]),
  };
}

/**
 * Shared vitals trend chart — consumes the same VitalRecord shape as VitalsTimeline.
 */
export default function VitalsChart({ records }: VitalsChartProps) {
  if (records.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          border: `1px solid ${meridian.border}`,
          background: meridian.surface,
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: meridian.textSecondary }}>
          No vital records available.
        </p>
      </div>
    );
  }

  const chartData: ChartPoint[] = records
    .slice()
    .sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    )
    .map((row) => {
      const bp = parseBp(row.bloodPressure);
      return {
        recordedAt: row.recordedAt,
        pulse: row.pulse,
        respiratoryRate: row.respiratoryRate,
        oxygenSaturation: row.oxygenSaturation,
        temperature: row.temperature,
        bpSystolic: bp.systolic,
        bpDiastolic: bp.diastolic,
      };
    });

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 16,
        border: `1px solid ${meridian.border}`,
        background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
        boxShadow:
          "0 1px 2px rgb(0 31 84 / 0.04), 0 8px 24px rgb(0 31 84 / 0.06)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "1.125rem",
          fontWeight: 700,
          color: meridian.textPrimary,
        }}
      >
        Vitals Chart
      </h2>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 14,
          color: meridian.textSecondary,
        }}
      >
        Time-series trend of patient vitals.
      </p>

      <div style={{ marginTop: 24, height: 320, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(0 31 84 / 0.08)" />

            <XAxis
              dataKey="recordedAt"
              tickFormatter={formatTick}
              tick={{ fontSize: 12, fill: meridian.textSecondary }}
            />

            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: meridian.textSecondary }}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: meridian.textSecondary }}
              width={40}
            />

            <Tooltip labelFormatter={(label) => formatTick(String(label))} />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pulse"
              name="Pulse (bpm)"
              stroke={meridian.danger}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="respiratoryRate"
              name="Resp. Rate (rpm)"
              stroke={meridian.success}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="oxygenSaturation"
              name="SpO₂ (%)"
              stroke={meridian.brandPrimary}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bpSystolic"
              name="BP Systolic"
              stroke="#7c3aed"
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bpDiastolic"
              name="BP Diastolic"
              stroke="#3d8bfd"
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperature"
              name="Temp (°C)"
              stroke={meridian.warning}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
