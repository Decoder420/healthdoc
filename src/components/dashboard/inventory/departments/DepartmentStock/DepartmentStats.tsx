"use client";

import { departmentStats } from "@/features/inventory/data/departmentStockData";

export default function DepartmentStats() {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {departmentStats.map((stat) => (
        <div
          key={stat.label}
          className="surface-card rounded-xl p-5"
        >
          <p className="text-sm text-muted-foreground">
            {stat.label}
          </p>

          <h3
            className={`mt-2 text-2xl font-bold ${
              stat.emphasis ?? "text-foreground"
            }`}
          >
            {stat.value}
          </h3>
        </div>
      ))}
    </section>
  );
}