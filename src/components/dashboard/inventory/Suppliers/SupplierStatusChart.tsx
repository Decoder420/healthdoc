"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Active", value: 88 },
  { name: "Inactive", value: 8 },
];

const COLORS = ["#001F54", "#D32F2F"];

export default function SupplierStatusChart() {
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Supplier Status
        </h3>

        <p className="text-sm text-muted-foreground">
          Distribution of active and inactive suppliers
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}