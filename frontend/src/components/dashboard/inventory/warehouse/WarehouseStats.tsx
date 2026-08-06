"use client";

import {
  ClipboardCheck,
  PackageCheck,
  PackagePlus,
  Boxes,
} from "lucide-react";

import type { WarehouseReceipt } from "@/features/inventory/types/warehouse";

interface Props {
  receipts: WarehouseReceipt[];
}

export default function WarehouseStats({
  receipts,
}: Props) {
  const pendingReceipts = receipts.filter(
    (receipt) =>
      receipt.status === "Pending" ||
      receipt.status === "Partially Received"
  ).length;

  const stockEntered = receipts.filter(
    (receipt) =>
      receipt.status === "Stock Entered"
  ).length;

  const receivedToday = receipts.filter(
    (receipt) =>
      receipt.status === "Received"
  ).length;

  const totalAccepted = receipts.reduce(
    (sum, receipt) =>
      sum + receipt.totalAcceptedQuantity,
    0
  );

  const stats = [
    {
      label: "Pending GRNs",
      value: pendingReceipts,
      description:
        "GRNs awaiting warehouse processing",
      icon: ClipboardCheck,
    },
    {
      label: "Received GRNs",
      value: receivedToday,
      description:
        "GRNs received by warehouse",
      icon: PackageCheck,
    },
    {
      label: "Stock Entries",
      value: stockEntered,
      description:
        "GRNs converted into stock",
      icon: PackagePlus,
    },
    {
      label: "Accepted Units",
      value: totalAccepted.toLocaleString("en-IN"),
      description:
        "Accepted inventory quantity",
      icon: Boxes,
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