"use client";

import {
  Truck,
  Star,
  CheckCircle,
} from "lucide-react";

const vendors = [
  {
    name: "Siemens Healthcare",
    delivery: 98,
    rating: 5,
    orders: 145,
    avgDays: 2,
  },
  {
    name: "GE Healthcare",
    delivery: 94,
    rating: 4,
    orders: 118,
    avgDays: 3,
  },
  {
    name: "Fujifilm India",
    delivery: 99,
    rating: 5,
    orders: 132,
    avgDays: 2,
  },
  {
    name: "Philips Healthcare",
    delivery: 90,
    rating: 4,
    orders: 96,
    avgDays: 4,
  },
];

export default function VendorPerformance() {
  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Vendor Performance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Supplier delivery and quality performance
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <Truck
            size={20}
            className="text-primary"
          />
        </div>
      </div>

      {/* Vendors */}
      <div className="space-y-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.name}
            className="rounded-lg border border-border bg-muted p-4 transition-colors hover:bg-accent"
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {vendor.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {vendor.orders} Orders Completed
                </p>
              </div>

              <div className="flex gap-1">
                {Array.from({ length: vendor.rating }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  On-Time Delivery
                </span>

                <span className="text-sm font-semibold text-primary">
                  {vendor.delivery}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${vendor.delivery}%`,
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle
                  size={16}
                  className="text-success"
                />

                <span className="text-sm">
                  Avg {vendor.avgDays} Days
                </span>
              </div>

              <span className="rounded-full bg-info-muted px-3 py-1 text-xs font-semibold text-info">
                Trusted
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}