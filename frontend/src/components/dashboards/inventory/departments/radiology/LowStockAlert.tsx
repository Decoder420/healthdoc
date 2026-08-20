"use client";

import { AlertTriangle, ShoppingCart } from "lucide-react";

const items = [
  {
    item: "14×17 X-Ray Film",
    current: 18,
    minimum: 50,
    priority: "High",
  },
  {
    item: "Gadolinium",
    current: 12,
    minimum: 40,
    priority: "High",
  },
  {
    item: "IV Cannula",
    current: 25,
    minimum: 60,
    priority: "Medium",
  },
  {
    item: "Lead Gloves",
    current: 8,
    minimum: 15,
    priority: "Low",
  },
];

export default function LowStockAlerts() {
  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Low Stock Alerts
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Items below minimum stock level
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-muted">
          <AlertTriangle
            size={20}
            className="text-danger"
          />
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.item}
            className="rounded-lg border border-border bg-muted p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-foreground">
                  {item.item}
                </h3>

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
              <button className="btn btn-primary btn-sm">
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