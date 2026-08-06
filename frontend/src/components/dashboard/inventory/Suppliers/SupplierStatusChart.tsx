"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Supplier } from "@/features/inventory/types/supplier";

interface Props {
  suppliers: Supplier[];
}

export default function SupplierStatusChart({
  suppliers,
}: Props) {
  const active = suppliers.filter(
    (supplier) => supplier.is_active
  ).length;

  const inactive = suppliers.filter(
    (supplier) => !supplier.is_active
  ).length;

  const data = [
    {
      name: "Active",
      value: active,
    },
    {
      name: "Inactive",
      value: inactive,
    },
  ];

  const COLORS = ["#001F54", "#D32F2F"];

  return (
    <div className="surface-card p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Supplier Status
        </h3>

        <p className="text-sm text-muted-foreground">
          Distribution of active and inactive suppliers
        </p>
      </div>

      <div className="h-72 w-full">
        {suppliers.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No supplier data available
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}