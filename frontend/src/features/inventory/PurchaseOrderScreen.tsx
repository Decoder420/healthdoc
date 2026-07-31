"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import PurchaseOrderTable from "@/components/dashboard/inventory/purchase/order/PurchaseOrderTable";

import { purchaseOrders } from "./data/purchaseOrderData";
import { PurchaseOrder } from "./types/purchaseOrder";

export default function PurchaseOrderScreen() {
  const { user } = useAuth();

  const [orders, setOrders] =
    useState<PurchaseOrder[]>(purchaseOrders);

  const handleView = (
    purchaseOrder: PurchaseOrder
  ) => {
    console.log(
      "View Purchase Order:",
      purchaseOrder
    );
  };

  const handleEdit = (
    purchaseOrder: PurchaseOrder
  ) => {
    console.log(
      "Edit Purchase Order:",
      purchaseOrder
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome,{" "}
            {user?.name ?? "Inventory Manager"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage purchase orders generated from
            approved purchase requisitions.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(
              "Create Purchase Order"
            );
          }}
        >
          Create Purchase Order
        </button>
      </div>

      {/* Purchase Order Table */}

      <section>
        <div className="surface-card overflow-hidden p-5">
          <PurchaseOrderTable
            purchaseOrders={orders}
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>
      </section>

    </div>
  );
}