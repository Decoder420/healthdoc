"use client";

import { useAuth } from "@/providers/auth-provider";
import ExpiryTable from "@/components/dashboards/inventory/dashboard/ExpiryTable";
import InventoryTrendChart from "@/components/dashboards/inventory/dashboard/InventoryTrendChart";
import LowStockCategoryChart from "@/components/dashboards/inventory/dashboard/LowStockCard";
import RecentInventoryTable from "@/components/dashboards/inventory/dashboard/RecentPurchasestable";
import {
  INVENTORY_ALERT_SUMMARY,
  INVENTORY_DASHBOARD_KPIS,
} from "@/features/inventory/dashboard-data";

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
        {INVENTORY_DASHBOARD_KPIS.map((stat) => (
          <article key={stat.label} className="surface-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-2xl font-bold ${stat.emphasis ?? "text-foreground"}`}>
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <section
        aria-label="Alert summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article className="surface-card border-l-4 border-l-destructive p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Critical low stock
          </p>
          <p className="mt-1 text-xl font-semibold text-destructive">
            {INVENTORY_ALERT_SUMMARY.criticalLowStock}
          </p>
        </article>
        <article className="surface-card border-l-4 border-l-amber-500 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Near expiry (≤15d)
          </p>
          <p className="mt-1 text-xl font-semibold text-amber-600">
            {INVENTORY_ALERT_SUMMARY.nearExpiry}
          </p>
        </article>
        <article className="surface-card border-l-4 border-l-rose-500 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Expired / overdue
          </p>
          <p className="mt-1 text-xl font-semibold text-rose-600">
            {INVENTORY_ALERT_SUMMARY.expiredOrNegative}
          </p>
        </article>
        <article className="surface-card border-l-4 border-l-sky-500 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            FEFO violations
          </p>
          <p className="mt-1 text-xl font-semibold text-sky-700">
            {INVENTORY_ALERT_SUMMARY.fefoViolations}
          </p>
        </article>
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
