"use client";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { departmentActivity } from "@/features/inventory/data/departmentStockData";

export default function DepartmentActivityChart() {
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Department Stock Activity
        </h3>

        <p className="text-sm text-muted-foreground">
          Monthly stock issued vs received across departments
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentActivity}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="issued"
              name="Stock Issued"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="received"
              name="Stock Received"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}