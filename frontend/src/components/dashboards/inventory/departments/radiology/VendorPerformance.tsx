"use client";

import { Truck, Star, CheckCircle } from "lucide-react";
import { RADIOLOGY_VENDORS } from "@/features/inventory/radiology-data";

export default function VendorPerformance() {
  return (
    <div className="surface-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Vendor Performance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {RADIOLOGY_VENDORS.length} suppliers tracked
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <Truck size={20} className="text-primary" />
        </div>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
        {RADIOLOGY_VENDORS.map((vendor) => {
          const rating = Math.max(1, Math.round(vendor.qualityScore));
          return (
            <div
              key={vendor.name}
              className="rounded-lg border border-border bg-muted p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {vendor.category} · {vendor.openPos} open POs
                  </p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: rating }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    On-Time Delivery
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {vendor.onTimePercent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${vendor.onTimePercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-sm">
                    Quality {vendor.qualityScore.toFixed(1)} / 5
                  </span>
                </div>
                <span className="rounded-full bg-info-muted px-3 py-1 text-xs font-semibold text-info">
                  Tracked
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
