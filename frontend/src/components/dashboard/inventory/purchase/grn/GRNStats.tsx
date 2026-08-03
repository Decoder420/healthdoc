
"use client";

import {
  ClipboardCheck,
  PackageCheck,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import { type GRN } from "@/features/inventory/types/grn";

interface Props {
  grns: GRN[];
}

export default function GRNStats({ grns }: Props) {
  const total = grns.length;

  const pendingInspection = grns.filter(
  (grn) => grn.status === "Pending Inspection"
).length;

const qcPassed = grns.filter(
  (grn) => grn.status === "QC Passed"
).length;

const qcFailed = grns.filter(
  (grn) => grn.status === "QC Failed"
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
      label: "Pending Inspection",
      value: pendingInspection,
      icon: Clock3,
      description:
        "Awaiting quality inspection",
    },
    {
      label: "QC Passed",
      value: qcPassed,
      icon: PackageCheck,
      description:
        "Goods cleared for stock entry",
    },
    {
      label: "QC Failed",
      value: qcFailed,
      icon: AlertTriangle,
      description:
        "Goods rejected during inspection",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
