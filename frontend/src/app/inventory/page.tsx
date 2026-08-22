"use client";

import { useCallback, useEffect, useState } from "react";

import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import { ExpiryTracker } from "@/features/pharmacy/ExpiryTracker";
import { listReorderAlerts } from "@/features/pharmacy/api";
import type { ReorderAlertItem } from "@/features/pharmacy/types";
import { ApiError } from "@/lib/api";

function Inventory() {
  const [alerts, setAlerts] = useState<ReorderAlertItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await listReorderAlerts();
      setAlerts(response.items);
      setError(null);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Could not load inventory alerts");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Inventory control</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Live reorder thresholds and batch-expiry exposure for this facility.
          </p>
        </div>
        <button type="button" className="text-sm underline" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-danger-muted p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Reorder alerts</h2>
          <p className="text-sm text-muted-foreground">
            Items at or below their configured reorder level.
          </p>
        </div>
        {alerts === null ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {alerts?.length === 0 ? (
          <div className="surface-card p-6 text-sm text-success">No items are below reorder level.</div>
        ) : null}
        {alerts && alerts.length > 0 ? (
          <div className="surface-card overflow-hidden">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-right">Current stock</th>
                  <th className="px-4 py-3 text-right">Reorder level</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((item) => (
                  <tr key={item.item_id} className="border-b border-border last:border-none">
                    <td className="px-4 py-3 font-medium">{item.item_name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-danger">
                      {item.current_stock}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{item.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Batch expiry</h2>
        <ExpiryTracker />
      </section>

      <section className="surface-card border border-warning p-5 text-sm">
        <h2 className="font-semibold">Receiving, indents and adjustments</h2>
        <p className="mt-2 text-muted-foreground">
          Mutations exist, but the backend publishes no supplier, stock-location, GRN, indent or
          adjustment list contracts. Those actions stay off this screen so operators are not asked
          to paste internal UUIDs or act without a review queue.
        </p>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <ModuleCapabilityGate module="pharmacy">
      <Inventory />
    </ModuleCapabilityGate>
  );
}
