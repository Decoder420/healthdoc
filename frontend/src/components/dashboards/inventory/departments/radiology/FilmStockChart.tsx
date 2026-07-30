"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RADIOLOGY_FILM_STOCK } from "@/features/inventory/radiology-data";

const COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#8b5cf6", "#f59e0b", "#64748b"];

export default function FilmStockChart() {
  const data = RADIOLOGY_FILM_STOCK.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <div className="surface-card p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">X-Ray Film Stock</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Distribution of film inventory by size
        </p>
      </div>

      <div className="mt-6 h-[240px] w-full">
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
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
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
