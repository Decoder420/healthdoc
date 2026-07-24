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

import { VitalRecord } from "./VitalsTimeline.types";

type VitalsChartProps = {
  records: VitalRecord[];
};

function formatTick(measuredAt: string): string {
  const date = new Date(measuredAt);
  if (isNaN(date.getTime())) return measuredAt;
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function VitalsChart({ records }: VitalsChartProps) {
  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No vital records available.
        </p>
      </div>
    );
  }

  const chartData = records
    .slice()
    .sort(
      (a, b) =>
        new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
    );

  return (
    <div className="surface-card p-6">
      <h2 className="text-lg font-semibold">Vitals Chart</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Time-series trend of patient vitals.
      </p>

      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="measured_at"
              tickFormatter={formatTick}
              tick={{ fontSize: 12 }}
            />

            <YAxis yAxisId="left" tick={{ fontSize: 12 }} width={40} />

            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} width={40} />

            <Tooltip labelFormatter={(label) => formatTick(String(label))} />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pulse_bpm"
              name="Pulse (bpm)"
              stroke="#b91c1c"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="resp_rate"
              name="Resp. Rate (rpm)"
              stroke="#166534"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="spo2_pct"
              name="SpO₂ (%)"
              stroke="#001f54"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bp_systolic"
              name="BP Systolic"
              stroke="#7c3aed"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bp_diastolic"
              name="BP Diastolic"
              stroke="#3d8bfd"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temp_c"
              name="Temp (°C)"
              stroke="#b45309"
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}