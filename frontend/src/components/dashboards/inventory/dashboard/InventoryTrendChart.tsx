"use client";

import { LineChart } from "@mui/x-charts/LineChart";

const inventoryTrend = [
  120,
  180,
  150,
  220,
  210,
  260,
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
];

export default function InventoryTrendChart() {
  return (
    <div className="chart-card">
      <h2 className="chart-title">
        Monthly Inventory Trend
      </h2>

      <p className="dashboard-subtitle">
        Inventory movement over the last six months
      </p>

      <div className="chart-body">
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: months,
            },
          ]}
          series={[
            {
              data: inventoryTrend,
              label: "Products",
              color: "var(--primary)",
            },
          ]}
          height={240}
        />
      </div>
    </div>
  );
}