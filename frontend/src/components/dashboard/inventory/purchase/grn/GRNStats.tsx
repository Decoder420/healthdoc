"use client";

import {
  ClipboardCheck,
  PackageCheck,
  Clock3,
  XCircle,
} from "lucide-react";

import type { GRN } from "@/features/inventory/types/grn";

interface Props {
  grns: GRN[];
}

export default function GRNStats({
  grns,
}: Props) {
  const total = grns.length;

  const drafts = grns.filter(
    (grn) => grn.status === "draft"
  ).length;

  const received = grns.filter(
    (grn) => grn.status === "received"
  ).length;

  const verified = grns.filter(
    (grn) => grn.status === "verified"
  ).length;

  const cancelled = grns.filter(
    (grn) => grn.status === "cancelled"
  ).length;

  const stats = [
    {
      label: "Total GRNs",
      value: total,
      icon: ClipboardCheck,
      description:
        "Goods received against purchase orders",
    },

    {
      label: "Draft",
      value: drafts,
      icon: Clock3,
      description:
        "GRNs not yet finalized",
    },

    {
      label: "Received",
      value: received,
      icon: PackageCheck,
      description:
        "Goods received and recorded",
    },

    {
      label: "Verified",
      value: verified,
      icon: PackageCheck,
      description:
        "Goods verified for stock entry",
    },

    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      description:
        "Cancelled goods receipts",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="surface-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Icon
                  size={20}
                  className="text-primary"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}