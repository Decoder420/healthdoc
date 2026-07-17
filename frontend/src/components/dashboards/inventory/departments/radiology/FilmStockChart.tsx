"use client";

import { PieChart } from "@mui/x-charts/PieChart";

const filmData = [
  { id: 0, value: 140, label: "8×10 Film" },
  { id: 1, value: 110, label: "10×12 Film" },
  { id: 2, value: 80, label: "14×17 Film" },
  { id: 3, value: 60, label: "Laser Film" },
];

export default function FilmStockChart() {
  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          X-Ray Film Stock
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Distribution of film inventory by size
        </p>
      </div>

      {/* Chart */}
      <div className="mt-6 flex justify-center overflow-x-auto">
        <PieChart
          width={360}
          height={240}
          series={[
            {
              data: filmData,
              innerRadius: 65,
              outerRadius: 100,
              paddingAngle: 3,
              cornerRadius: 4,
            },
          ]}
          sx={{
            "& .MuiChartsLegend-label": {
              fill: "var(--foreground)",
            },
            "& .MuiChartsLegend-mark": {
              stroke: "none",
            },
          }}
        />
      </div>
    </div>
  );
}