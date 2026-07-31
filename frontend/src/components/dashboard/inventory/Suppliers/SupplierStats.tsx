"use client";

import { supplierStats } from "@/features/inventory/data/supplierData";

export default function SupplierStats() {
  return (
    <section
      aria-label="Supplier summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      {supplierStats.map((stat) => (
        <article key={stat.label} className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            {stat.label}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              stat.emphasis ?? "text-foreground"
            }`}
          >
            {stat.value}
          </p>
        </article>
      ))}
    </section>
  );
}