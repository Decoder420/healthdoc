"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LOW_STOCK_BY_CATEGORY } from "@/features/inventory/dashboard-data";

const COLORS = [
  "#2563eb",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#64748b",
];

export default function LowStockCategoryChart() {
  const total = LOW_STOCK_BY_CATEGORY.reduce((sum, slice) => sum + slice.value, 0);
  const data = LOW_STOCK_BY_CATEGORY.map((slice) => ({
    name: slice.label,
    value: slice.value,
  }));

  return (
    <div className="chart-card">
      <h2 className="chart-title">Low Stock Categories</h2>
      <p className="dashboard-subtitle">
        {total} items below reorder level across {LOW_STOCK_BY_CATEGORY.length}{" "}
        categories
      </p>

      <div className="chart-body h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
