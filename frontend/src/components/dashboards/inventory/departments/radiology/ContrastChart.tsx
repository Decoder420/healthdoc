"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { ChartWrapper } from "@/components/ui";
import { meridian } from "@/styles/theme";

const contrastData = [
  { name: "Iohexol", stock: 120 },
  { name: "Iopamidol", stock: 95 },
  { name: "Gadolinium", stock: 60 },
  { name: "Barium", stock: 150 },
];

export default function ContrastChart() {
  return (
    <ChartWrapper
      title="Contrast Media Stock"
      description="Available stock of contrast media"
      height={260}
    >
      <BarChart data={contrastData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="4 6" vertical={false} stroke={meridian.border} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: meridian.textSecondary, fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: meridian.textSecondary, fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="stock" fill={meridian.brandPrimary} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
