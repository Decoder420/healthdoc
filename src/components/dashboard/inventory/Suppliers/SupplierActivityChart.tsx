"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supplierActivity } from "@/features/inventory/data/supplierData";

export default function SupplierActivityChart() {
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Supplier Activity
        </h3>

        <p className="text-sm text-muted-foreground">
          New suppliers added over the last six months
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={supplierActivity}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="month" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="suppliers"
              stroke="#001F54"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}