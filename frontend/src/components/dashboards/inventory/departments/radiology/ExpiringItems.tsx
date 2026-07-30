"use client";

import { CalendarClock } from "lucide-react";
import { RADIOLOGY_EXPIRING } from "@/features/inventory/radiology-data";

export default function ExpiringItems() {
  return (
    <div className="surface-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Expiring Items
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            FEFO monitoring · {RADIOLOGY_EXPIRING.length} lots
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-muted">
          <CalendarClock size={20} className="text-warning" />
        </div>
      </div>

      <div className="max-h-96 space-y-5 overflow-y-auto pr-1">
        {RADIOLOGY_EXPIRING.map((item) => {
          const progress = Math.min(
            100,
            Math.max(8, (item.daysLeft / 60) * 100),
          );

          return (
            <div
              key={`${item.batch}-${item.item}`}
              className="rounded-lg border border-border bg-muted p-4"
            >
              <h3 className="font-medium text-foreground">{item.item}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Batch {item.batch} · Expiry {item.expiry} · Qty {item.quantity}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-warning transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-warning">
                {item.daysLeft} days remaining
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
