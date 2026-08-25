"use client";

import { useCallback, useEffect, useState } from "react";

import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import { ExpiryTracker } from "@/features/pharmacy/ExpiryTracker";
import { AdjustmentWorkspace } from "@/features/inventory/AdjustmentWorkspace";
import { GrnWorkspace } from "@/features/inventory/GrnWorkspace";
import { PurchaseOrderWorkspace } from "@/features/inventory/PurchaseOrderWorkspace";
import { StockTransferWorkspace } from "@/features/inventory/StockTransferWorkspace";
import { IndentWorkspace } from "@/features/inventory/IndentWorkspace";
import { listReorderAlerts } from "@/features/pharmacy/api";
import type { ReorderAlertItem } from "@/features/pharmacy/types";
import { ApiError } from "@/lib/api";

type StockTab = "purchase-orders" | "grn" | "transfers" | "indents" | "adjustments";

// Ordered as the goods move: ordered -> received -> moved between stores ->
// requested by a ward -> corrected. A storekeeper reading left to right is
// following the same path the stock takes.
const STOCK_TABS: Array<{ id: StockTab; label: string }> = [
  { id: "purchase-orders", label: "Purchase orders" },
  { id: "grn", label: "Goods receipt" },
  { id: "transfers", label: "Transfers" },
  { id: "indents", label: "Indents" },
  { id: "adjustments", label: "Adjustments" },
];

function Inventory() {
  const [tab, setTab] = useState<StockTab>("purchase-orders");
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

      {/*
        This was a warning panel explaining why receiving, indents and
        adjustments were absent: the mutations existed, but no supplier,
        stock-location, GRN, indent or adjustment LIST contract did, so the
        screen would have had to ask operators to paste UUIDs and would have
        given approvers no queue to work from. That diagnosis was exactly
        right. Those six reads now exist, so the panel is replaced by the
        workflows it was standing in for.
      */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Stock movement</h2>
          <p className="text-sm text-muted-foreground">
            Ordering, receiving, moving, requesting and correcting — in the order
            the stock itself travels. Every step is reviewed or countersigned by
            someone other than the person who started it.
          </p>
        </div>

        <div className="flex gap-1 border-b border-border">
          {STOCK_TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={`px-4 py-2 text-sm ${
                tab === entry.id
                  ? "border-b-2 border-blue-700 font-medium text-blue-700"
                  : "text-muted-foreground"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {tab === "purchase-orders" ? <PurchaseOrderWorkspace /> : null}
        {tab === "grn" ? <GrnWorkspace /> : null}
        {tab === "transfers" ? <StockTransferWorkspace /> : null}
        {tab === "indents" ? <IndentWorkspace /> : null}
        {tab === "adjustments" ? <AdjustmentWorkspace /> : null}
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
