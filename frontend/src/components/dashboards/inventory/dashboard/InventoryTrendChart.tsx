"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartWrapper } from "@/components/ui";
import { meridian } from "@/styles/theme";

const data = [
  { month: "Jan", products: 120 },
  { month: "Feb", products: 180 },
  { month: "Mar", products: 150 },
  { month: "Apr", products: 220 },
  { month: "May", products: 210 },
  { month: "Jun", products: 260 },
];

export default function InventoryTrendChart() {
  return (
    <ChartWrapper
      title="Monthly Inventory Trend"
      description="Inventory movement over the last six months"
      height={260}
    >
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id="invTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={meridian.brandPrimary} stopOpacity={0.28} />
            <stop offset="100%" stopColor={meridian.brandPrimary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 6" vertical={false} stroke={meridian.border} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: meridian.textSecondary, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: meridian.textSecondary, fontSize: 12 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="products"
          stroke={meridian.brandPrimary}
          strokeWidth={2.5}
          fill="url(#invTrend)"
        />
      </AreaChart>
    </ChartWrapper>
  );
}
