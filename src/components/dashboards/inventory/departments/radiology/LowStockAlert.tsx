"use client";

import { AlertTriangle, ShoppingCart } from "lucide-react";
import { RADIOLOGY_LOW_STOCK } from "@/features/inventory/radiology-data";

export default function LowStockAlerts() {
  return (
    <div className="surface-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Low Stock Alerts
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {RADIOLOGY_LOW_STOCK.length} items below minimum stock level
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-muted">
          <AlertTriangle size={20} className="text-danger" />
        </div>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
        {RADIOLOGY_LOW_STOCK.map((item) => (
          <div
            key={item.item}
            className="rounded-lg border border-border bg-muted p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-foreground">{item.item}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.current} remaining / Min {item.minimum}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.priority === "High"
                    ? "bg-danger-muted text-danger"
                    : item.priority === "Medium"
                      ? "bg-warning-muted text-warning"
                      : "bg-success-muted text-success"
                }`}
              >
                {item.priority}
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" className="btn btn-primary btn-sm">
                <ShoppingCart size={16} />
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
