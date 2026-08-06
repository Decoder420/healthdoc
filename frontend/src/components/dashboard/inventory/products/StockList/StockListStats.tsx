"use client";

import {
  Package,
  Boxes,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

interface Props {
  totalItems: number;
  totalQuantity: number;
  lowStock: number;
  warehouses: number;
}

export default function StockListStats({
  totalItems,
  totalQuantity,
  lowStock,
  warehouses,
}: Props) {
  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
    },
    {
      title: "Total Quantity",
      value: totalQuantity,
      icon: Boxes,
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
    },
    {
      title: "Warehouses",
      value: warehouses,
      icon: Warehouse,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </h3>
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <Icon className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}