"use client";

import { ShoppingCart } from "lucide-react";
import { RADIOLOGY_PURCHASE_ORDERS } from "@/features/inventory/radiology-data";

export default function PurchaseOrders() {
  return (
    <div className="surface-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Purchase Orders
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {RADIOLOGY_PURCHASE_ORDERS.length} procurement requests
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <ShoppingCart size={20} className="text-primary" />
        </div>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
        {RADIOLOGY_PURCHASE_ORDERS.map((order) => {
          const badgeClass =
            order.status === "Pending"
              ? "bg-warning-muted text-warning"
              : order.status === "Approved"
                ? "bg-info-muted text-info"
                : order.status === "Partially Received"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-success-muted text-success";

          return (
            <div
              key={order.po}
              className="rounded-lg border border-border bg-muted p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{order.po}</h3>
                  <p className="mt-1 text-sm text-foreground">{order.item}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.supplier}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-primary">{order.amount}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
