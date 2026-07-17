"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { ChartWrapper } from "@/components/ui";
import { meridian } from "@/styles/theme";

const filmData = [
  { name: "8×10 Film", value: 140, fill: meridian.brandPrimary },
  { name: "10×12 Film", value: 110, fill: "#3B82F6" },
  { name: "14×17 Film", value: 80, fill: "#64748b" },
  { name: "Laser Film", value: 60, fill: "#94a3b8" },
];

export default function FilmStockChart() {
  return (
    <ChartWrapper
      title="X-Ray Film Stock"
      description="Distribution of film inventory by size"
      height={260}
    >
      <PieChart>
        <Pie
          data={filmData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        >
          {filmData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ChartWrapper>
  );
}
