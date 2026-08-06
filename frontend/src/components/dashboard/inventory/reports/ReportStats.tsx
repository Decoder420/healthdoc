"use client";

import type {
  InventoryReportRow,
} from "@/features/inventory/types/report";

interface Props {
  rows: InventoryReportRow[];
}

export default function ReportStats({
  rows,
}: Props) {
  const totalItems = rows.length;

  const totalStock = rows.reduce(
    (sum, row) =>
      sum + row.availableStock,
    0
  );

  const totalStockValue = rows.reduce(
    (sum, row) =>
      sum + row.stockValue,
    0
  );

  const lowStock = rows.filter(
    (row) =>
      row.status === "Low Stock"
  ).length;

  const nearExpiry = rows.filter(
    (row) =>
      row.status === "Near Expiry"
  ).length;

  const stats = [
    {
      label: "Total Items",
      value: totalItems,
    },
    {
      label: "Available Stock",
      value: totalStock,
    },
    {
      label: "Low Stock",
      value: lowStock,
    },
    {
      label: "Near Expiry",
      value: nearExpiry,
    },
    {
      label: "Stock Value",
      value: `₹${totalStockValue.toLocaleString(
        "en-IN"
      )}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="surface-card p-5"
        >
          <p className="text-sm text-muted-foreground">
            {stat.label}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}