"use client";

import { ShoppingCart } from "lucide-react";

const orders = [
  {
    po: "PO-1001",
    supplier: "Siemens Healthcare",
    item: "CT Contrast Media",
    amount: "₹1,45,000",
    status: "Pending",
  },
  {
    po: "PO-1002",
    supplier: "Fujifilm",
    item: "X-Ray Films",
    amount: "₹82,000",
    status: "Approved",
  },
  {
    po: "PO-1003",
    supplier: "GE Healthcare",
    item: "MRI Contrast",
    amount: "₹2,10,000",
    status: "Delivered",
  },
];

export default function PurchaseOrders() {
  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Purchase Orders
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest procurement requests
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <ShoppingCart
            size={20}
            className="text-primary"
          />
        </div>
      </div>

      {/* Purchase Orders */}
      <div className="space-y-4">
        {orders.map((order) => {
          const badgeClass =
            order.status === "Pending"
              ? "bg-warning-muted text-warning"
              : order.status === "Approved"
              ? "bg-info-muted text-info"
              : "bg-success-muted text-success";

          return (
            <div
              key={order.po}
              className="rounded-lg border border-border bg-muted p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {order.po}
                  </h3>

                  <p className="mt-1 text-sm text-foreground">
                    {order.item}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.supplier}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-primary">
                    {order.amount}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}