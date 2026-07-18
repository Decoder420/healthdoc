"use client";

import { useAuth } from "@/providers/auth-provider";
import ExpiryTable from "@/components/dashboards/inventory/dashboard/ExpiryTable";
import InventoryTrendChart from "@/components/dashboards/inventory/dashboard/InventoryTrendChart";
import LowStockCategoryChart from "@/components/dashboards/inventory/dashboard/LowStockCard";
import RecentInventoryTable from "@/components/dashboards/inventory/dashboard/RecentPurchasestable";

const inventoryStats = [
  { label: "Products", value: "2,150" },
  { label: "Low Stock", value: "18", emphasis: "text-destructive" },
  { label: "Suppliers", value: "96" },
  { label: "Orders", value: "124" },
  { label: "Expiring", value: "30", emphasis: "text-amber-600" },
  { label: "Stock Value", value: "₹4.0M" },
];

export function InventoryScreen() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {user?.name ?? "Inventory Manager"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor hospital stock, suppliers, orders, and expiring items.
        </p>
      </div>

      <section
        aria-label="Inventory summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {inventoryStats.map((stat) => (
          <article key={stat.label} className="surface-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-2xl font-bold ${stat.emphasis ?? "text-foreground"}`}>
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-5">
          <InventoryTrendChart />
        </div>
        <div className="surface-card p-5">
          <LowStockCategoryChart />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card overflow-hidden p-5">
          <RecentInventoryTable />
        </div>
        <div className="surface-card overflow-hidden p-5">
          <ExpiryTable />
        </div>
      </section>
    </div>
  );
}
