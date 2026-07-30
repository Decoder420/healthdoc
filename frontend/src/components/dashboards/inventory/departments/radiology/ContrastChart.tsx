"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RADIOLOGY_CONTRAST_STOCK } from "@/features/inventory/radiology-data";

export default function ContrastChart() {
  const data = RADIOLOGY_CONTRAST_STOCK.map((item) => ({
    name: item.label,
    stock: item.value,
  }));

  return (
    <div className="surface-card p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Contrast Media Stock
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Available stock of contrast media
      </p>

      <div className="mt-6 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip />
            <Bar dataKey="stock" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
