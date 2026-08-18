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

interface MiniChartProps {
  title: string;
  data: VitalRecord[];
  lines: { dataKey: keyof VitalRecord; name: string; stroke: string }[];
  yDomain?: [number, number];
}

function formatTick(measuredAt: string): string {
  const date = new Date(measuredAt);
  if (Number.isNaN(date.getTime())) return measuredAt;
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function MiniChart({ title, data, lines, yDomain }: MiniChartProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-muted-foreground">{title}</p>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(0 31 84 / 0.08)" />

            <XAxis
              dataKey="measured_at"
              tickFormatter={formatTick}
              tick={{ fontSize: 11, fill: meridian.textSecondary }}
            />

            <YAxis
              domain={yDomain ?? ["auto", "auto"]}
              tick={{ fontSize: 11, fill: meridian.textSecondary }}
              width={36}
            />

            <Tooltip labelFormatter={(label) => formatTick(String(label))} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            {lines.map((line) => (
              <Line
                key={String(line.dataKey)}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.stroke}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function VitalsChart({ records }: VitalsChartProps) {
  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">No vital records available.</p>
      </div>
    );
  }

  const chartData = records
    .slice()
    .sort(
      (a, b) =>
        new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime(),
    );

  return (
    <div className="surface-card p-6">
      <h2 className="text-lg font-semibold" style={{ color: meridian.textPrimary }}>
        Vitals Chart
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Time-series trend of patient vitals.
      </p>

      {/* Split into clinically-grouped small charts instead of one shared
          axis — pulse (~60-100), resp. rate (~12-20), BP (~80-140), and
          SpO2 (~90-100%) have very different scales, so plotting them
          together on one axis compresses smaller-range values. */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <MiniChart
          title="Pulse & Respiratory Rate"
          data={chartData}
          lines={[
            { dataKey: "pulse_bpm", name: "Pulse (bpm)", stroke: meridian.danger },
            { dataKey: "resp_rate", name: "Resp. Rate (rpm)", stroke: meridian.success },
          ]}
        />

        <MiniChart
          title="Blood Pressure"
          data={chartData}
          lines={[
            { dataKey: "bp_systolic", name: "BP Systolic", stroke: "#7c3aed" },
            { dataKey: "bp_diastolic", name: "BP Diastolic", stroke: "#3d8bfd" },
          ]}
        />

        <MiniChart
          title="SpO₂"
          data={chartData}
          lines={[{ dataKey: "spo2_pct", name: "SpO₂ (%)", stroke: meridian.brandPrimary }]}
          yDomain={[50, 100]}
        />

        <MiniChart
          title="Temperature"
          data={chartData}
          lines={[{ dataKey: "temp_c", name: "Temp (°C)", stroke: meridian.warning }]}
          yDomain={[30, 45]}
        />
      </div>
    </div>
  );
}
