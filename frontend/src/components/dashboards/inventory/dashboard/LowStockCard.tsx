"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { ChartWrapper } from "@/components/ui";
import { meridian } from "@/styles/theme";

const lowStockData = [
  { name: "Medicines", value: 18, fill: meridian.brandPrimary },
  { name: "Consumables", value: 10, fill: "#3B82F6" },
  { name: "Equipment", value: 7, fill: meridian.warning },
  { name: "Surgical Items", value: 5, fill: meridian.danger },
];

export default function LowStockCategoryChart() {
  return (
    <ChartWrapper
      title="Low Stock Categories"
      description="Distribution of items below reorder level"
      height={240}
    >
      <PieChart>
        <Pie data={lowStockData} dataKey="value" nameKey="name" outerRadius={80} paddingAngle={3}>
          {lowStockData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ChartWrapper>
  );
}
