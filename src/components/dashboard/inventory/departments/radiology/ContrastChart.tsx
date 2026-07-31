"use client";

import { BarChart } from "@mui/x-charts/BarChart";

const contrastData = [
  { name: "Iohexol", stock: 120 },
  { name: "Iopamidol", stock: 95 },
  { name: "Gadolinium", stock: 60 },
  { name: "Barium", stock: 150 },
];

export default function ContrastChart() {
  return (
    <div className="surface-card p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Contrast Media Stock
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Available stock of contrast media
      </p>

      <div className="mt-6 flex justify-center overflow-x-auto">
        <BarChart
          height={250}
          xAxis={[
            {
              scaleType: "band",
              data: contrastData.map((item) => item.name),
            },
          ]}
          series={[
            {
              data: contrastData.map((item) => item.stock),
              color: "var(--primary)",
            },
          ]}
          width={520}
        />
      </div>
    </div>
  );
}