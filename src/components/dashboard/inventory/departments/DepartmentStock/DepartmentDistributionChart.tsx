"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { departmentDistribution } from "@/features/inventory/data/departmentStockData";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#64748B",
];

export default function DepartmentDistributionChart() {
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Department Inventory Distribution
        </h3>

        <p className="text-sm text-muted-foreground">
          Inventory allocation across hospital departments
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={3}
            >
              {departmentDistribution.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend verticalAlign="bottom" height={40} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}