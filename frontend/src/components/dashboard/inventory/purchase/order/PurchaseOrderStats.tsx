"use client";

import {
  ClipboardList,
  Clock3,
  Send,
  IndianRupee,
} from "lucide-react";

import { PurchaseOrder } from "@/features/inventory/types/purchaseOrder";

interface Props {
  purchaseOrders: PurchaseOrder[];
}

export default function PurchaseOrderStats({
  purchaseOrders,
}: Props) {
  const totalOrders = purchaseOrders.length;

  const pendingApproval = purchaseOrders.filter(
    (order) => order.status === "Pending Approval"
  ).length;

  const sentToSupplier = purchaseOrders.filter(
    (order) => order.status === "Sent to Supplier"
  ).length;

  const totalValue = purchaseOrders.reduce(
    (sum, order) => sum + order.grandTotal,
    0
  );

  const stats = [
    {
      label: "Total Purchase Orders",
      value: totalOrders,
      icon: ClipboardList,
      description: "All purchase orders",
    },
    {
      label: "Pending Approval",
      value: pendingApproval,
      icon: Clock3,
      description: "Awaiting approval",
    },
    {
      label: "Sent to Supplier",
      value: sentToSupplier,
      icon: Send,
      description: "Orders sent to suppliers",
    },
    {
      label: "Total PO Value",
      value: `₹${totalValue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "Total order value",
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

                <p className="mt-2 text-2xl font-semibold text-foreground">
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