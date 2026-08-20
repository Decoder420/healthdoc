"use client";

import { CalendarClock } from "lucide-react";

const expiry = [
  {
    item: "Iohexol Contrast",
    expiry: "15 Aug 2026",
    days: 28,
  },
  {
    item: "Barium Sulphate",
    expiry: "02 Aug 2026",
    days: 15,
  },
  {
    item: "Disposable Syringes",
    expiry: "25 Jul 2026",
    days: 7,
  },
  {
    item: "Contrast Tubing",
    expiry: "20 Jul 2026",
    days: 2,
  },
];

export default function ExpiringItems() {
  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Expiring Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            FEFO Monitoring
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-muted">
          <CalendarClock
            size={20}
            className="text-warning"
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-5">
        {expiry.map((item) => {
          const progress = Math.min(
            100,
            Math.max(10, (item.days / 30) * 100)
          );

          return (
            <div
              key={item.item}
              className="rounded-lg border border-border bg-muted p-4"
            >
              <h3 className="font-medium text-foreground">
                {item.item}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Expiry: {item.expiry}
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-warning transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm font-medium text-warning">
                {item.days} days remaining
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}