"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { INVENTORY_TREND } from "@/features/inventory/dashboard-data";

export default function InventoryTrendChart() {
  return (
    <div className="chart-card">
      <h2 className="chart-title">Monthly Inventory Trend</h2>
      <p className="dashboard-subtitle">
        Inbound, outbound, and closing stock over 24 months
      </p>

      <div className="chart-body h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={INVENTORY_TREND} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="inbound"
              name="Inbound"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outbound"
              name="Outbound"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="closingStock"
              name="Closing stock"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
