"use client";

import { PieChart } from "@mui/x-charts/PieChart";

const lowStockData = [
  {
    id: 0,
    value: 18,
    label: "Medicines",
  },
  {
    id: 1,
    value: 10,
    label: "Consumables",
  },
  {
    id: 2,
    value: 7,
    label: "Equipment",
  },
  {
    id: 3,
    value: 5,
    label: "Surgical Items",
  },
];

export default function LowStockCategoryChart() {
  return (
    <div className="chart-card">
      <h2 className="chart-title">
        Low Stock Categories
      </h2>

      <p className="dashboard-subtitle">
        Distribution of items below reorder level
      </p>

      <div className="chart-body flex justify-center">
        <PieChart
          height={240}
          width={360}
          series={[
            {
              data: lowStockData,
              innerRadius: 65,
              outerRadius: 100,
              paddingAngle: 3,
              cornerRadius: 5,
            },
          ]}
        />
      </div>
    </div>
  );
}