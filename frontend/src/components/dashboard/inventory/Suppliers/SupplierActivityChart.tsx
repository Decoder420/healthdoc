"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Supplier } from "@/features/inventory/types/supplier";

interface Props {
  suppliers: Supplier[];
}

export default function SupplierActivityChart({
  suppliers,
}: Props) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];

  /*
   * If your Supplier type has created_at,
   * calculate actual supplier registrations.
   *
   * Otherwise we still render the chart safely
   * with zero values.
   */

  const supplierActivity = months.map((month, index) => {
    const monthNumber = index + 1;

    const count = suppliers.filter((supplier) => {
      const supplierWithDate =
        supplier as Supplier & {
          created_at?: string;
          createdAt?: string;
        };

      const dateValue =
        supplierWithDate.created_at ??
        supplierWithDate.createdAt;

      if (!dateValue) {
        return false;
      }

      const date = new Date(dateValue);

      return (
        !Number.isNaN(date.getTime()) &&
        date.getMonth() + 1 === monthNumber
      );
    }).length;

    return {
      month,
      suppliers: count,
    };
  });

  return (
    <div className="surface-card p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Supplier Activity
        </h3>

        <p className="text-sm text-muted-foreground">
          New suppliers added over the last six months
        </p>
      </div>

      <div className="h-72 w-full">
        {suppliers.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No supplier activity available
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
        )}
      </div>
    </div>
  );
}