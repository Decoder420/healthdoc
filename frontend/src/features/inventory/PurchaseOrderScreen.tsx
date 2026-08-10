"use client";

import { useEffect, useState } from "react";

import PurchaseOrderTable from "@/components/dashboard/inventory/purchase/order/PurchaseOrderTable";
import PurchaseOrderViewDialog from "@/components/dashboard/inventory/purchase/order/PurchaseOrderViewDialog";

import {
  purchaseOrders as initialPurchaseOrders,
  getStoredPurchaseOrders,
  savePurchaseOrders,
} from "./data/purchaseOrderData";

import { createGRN } from "./data/grnData";

import type { PurchaseOrder } from "./types/purchaseOrder";
import type { GRN } from "./types/grn";

export default function PurchaseOrderScreen() {
  /*
   * ============================================================
   * PURCHASE ORDERS
   * ============================================================
   */

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(initialPurchaseOrders);

  useEffect(() => {
    const storedOrders = getStoredPurchaseOrders(
      initialPurchaseOrders
    );

    setPurchaseOrders(storedOrders);
  }, []);

  /*
   * ============================================================
   * VIEW PURCHASE ORDER
   * ============================================================
   */

  const [viewPurchaseOrder, setViewPurchaseOrder] =
    useState<PurchaseOrder | null>(null);

  /*
   * ============================================================
   * VIEW
   * ============================================================
   */

  const handleView = (
    purchaseOrder: PurchaseOrder
  ) => {
    setViewPurchaseOrder(purchaseOrder);
  };

  /*
   * ============================================================
   * APPROVE PURCHASE ORDER
   * ============================================================
   */

  const handleApprove = (
    purchaseOrder: PurchaseOrder
  ) => {
    if (
      purchaseOrder.status !==
      "Pending Approval"
    ) {
      return;
    }

    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,

      status: "Approved",

      approvedBy:
        "Inventory Manager",

      approvedAt:
        new Date().toISOString(),
    };

    const updatedOrders =
      purchaseOrders.map((po) =>
        po.id === purchaseOrder.id
          ? updatedPurchaseOrder
          : po
      );

    setPurchaseOrders(
      updatedOrders
    );

    savePurchaseOrders(
      updatedOrders
    );
  };

  /*
   * ============================================================
   * SEND TO SUPPLIER
   * ============================================================
   */

  const handleSendToSupplier = (
    purchaseOrder: PurchaseOrder
  ) => {
    if (
      purchaseOrder.status !==
      "Approved"
    ) {
      return;
    }

    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,

      status:
        "Sent to Supplier",
    };

    const updatedOrders =
      purchaseOrders.map((po) =>
        po.id === purchaseOrder.id
          ? updatedPurchaseOrder
          : po
      );

    setPurchaseOrders(
      updatedOrders
    );

    savePurchaseOrders(
      updatedOrders
    );
  };

  /*
   * ============================================================
   * CREATE GRN DIRECTLY
   * ============================================================
   *
   * Flow:
   *
   * Sent to Supplier
   *        ↓
   * Create GRN
   *        ↓
   * Save GRN to localStorage
   *        ↓
   * Update PO
   *
   * No GRN dialog is required.
   */
const handleCreateGRN = (
  purchaseOrder: PurchaseOrder
) => {
  console.log(
    "CREATE GRN CLICKED",
    purchaseOrder
  );

  /*
   * ----------------------------------------------------------
   * VALIDATE PO STATUS
   * ----------------------------------------------------------
   */

  if (
    purchaseOrder.status !== "Sent to Supplier" &&
    purchaseOrder.status !== "Partially Received"
  ) {
    alert(
      "GRN can only be created after the Purchase Order is sent to the supplier."
    );

    return;
  }

  /*
   * ----------------------------------------------------------
   * GENERATE GRN IDENTIFIERS
   * ----------------------------------------------------------
   */

  const timestamp = Date.now();

  const grnId = `GRN-${timestamp}`;

  const grnNumber =
    `GRN-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${timestamp
      .toString()
      .slice(-4)}`;

  /*
   * ----------------------------------------------------------
   * CREATE GRN ITEMS FROM PO
   * ----------------------------------------------------------
   */

  const grnItems =
    purchaseOrder.purchaseOrderItems.map(
      (item, index) => ({
        id: `${grnId}-ITEM-${index + 1}`,

        grnId,

        itemId: item.itemId,

        itemName: item.itemName,

        /*
         * These can be updated during
         * physical verification later.
         */

        batchNumber: "PENDING",

        expiryDate: "PENDING",

        quantity: item.orderedQuantity,

        receivedQuantity: item.orderedQuantity,

        unitPrice: item.unitRate,

        amount:
          item.orderedQuantity *
          item.unitRate,
      })
    );

  /*
   * ----------------------------------------------------------
   * CREATE GRN OBJECT
   * ----------------------------------------------------------
   */

  const grn: GRN = {
    id: grnId,

    grnNumber,

    purchaseOrderId:
      purchaseOrder.id,

    poNumber:
      purchaseOrder.poNumber,

    requisitionNumber:
      purchaseOrder.requisitionNumber,

    supplierId:
      purchaseOrder.supplierId ?? "",

    supplierName:
      purchaseOrder.supplierName,

    receivedDate:
      new Date().toLocaleDateString(),

    status: "received",

    grnItems,

    totalItems:
      grnItems.length,

    totalQuantity:
      grnItems.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      ),

    createdAt:
      new Date().toISOString(),

    receivedBy:
      "Inventory Manager",

    remarks:
      `Goods received against ${purchaseOrder.poNumber}.`,
  };

  /*
   * ----------------------------------------------------------
   * SAVE GRN
   * ----------------------------------------------------------
   */

  console.log(
    "Saving GRN:",
    grn
  );

  createGRN(grn);

  /*
   * ----------------------------------------------------------
   * UPDATE PURCHASE ORDER
   * ----------------------------------------------------------
   */

  const updatedItems =
    purchaseOrder.purchaseOrderItems.map(
      (item) => ({
        ...item,

        receivedQuantity:
          item.orderedQuantity,
      })
    );

  const updatedPurchaseOrder:
    PurchaseOrder = {
      ...purchaseOrder,

      purchaseOrderItems:
        updatedItems,

      status:
        "Fully Received",
    };

  const updatedOrders =
    purchaseOrders.map(
      (po) =>
        po.id === purchaseOrder.id
          ? updatedPurchaseOrder
          : po
    );

  setPurchaseOrders(
    updatedOrders
  );

  savePurchaseOrders(
    updatedOrders
  );

  /*
   * ----------------------------------------------------------
   * VERIFY LOCAL STORAGE
   * ----------------------------------------------------------
   */

  console.log(
    "GRN saved successfully:",
    localStorage.getItem(
      "hospital_grns"
    )
  );

  /*
   * ----------------------------------------------------------
   * SUCCESS
   * ----------------------------------------------------------
   */

  alert(
    `${grnNumber} created successfully.`
  );

  /*
   * ----------------------------------------------------------
   * GO TO GRN PAGE
   * ----------------------------------------------------------
   */

  window.location.href =
    "/inventory/purchase/grn";
};

  /*
   * ============================================================
   * CANCEL PURCHASE ORDER
   * ============================================================
   */

  const handleCancel = (
    purchaseOrder: PurchaseOrder
  ) => {
    /*
     * Do not allow cancellation after
     * goods have started being received.
     */

    if (
      purchaseOrder.status ===
        "Partially Received" ||
      purchaseOrder.status ===
        "Fully Received" ||
      purchaseOrder.status ===
        "Closed" ||
      purchaseOrder.status ===
        "Cancelled"
    ) {
      return;
    }

    const updatedPurchaseOrder:
      PurchaseOrder = {
        ...purchaseOrder,

        status:
          "Cancelled",
      };

    const updatedOrders =
      purchaseOrders.map((po) =>
        po.id === purchaseOrder.id
          ? updatedPurchaseOrder
          : po
      );

    setPurchaseOrders(
      updatedOrders
    );

    savePurchaseOrders(
      updatedOrders
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div>
        <p className="text-sm font-medium text-primary">
          Purchase Management
        </p>

        <h1 className="text-2xl font-bold text-foreground">
          Purchase Orders
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage purchase orders generated from
          approved purchase requisitions.
        </p>
      </div>

      {/* ======================================================
          PURCHASE ORDER TABLE
          ====================================================== */}

      <section>
        <div className="surface-card overflow-hidden p-5">

         <PurchaseOrderTable
         purchaseOrders={purchaseOrders}
         onView={handleView}
         onApprove={handleApprove}
         onSendToSupplier={handleSendToSupplier}
         onCreateGRN={handleCreateGRN}
         onCancel={handleCancel}
       />

        </div>
      </section>

      {/* ======================================================
          VIEW PURCHASE ORDER
          ====================================================== */}

      {viewPurchaseOrder && (
        <PurchaseOrderViewDialog
          open={true}

          purchaseOrder={
            viewPurchaseOrder
          }

          onClose={() =>
            setViewPurchaseOrder(
              null
            )
          }
        />
      )}

    </div>
  );
}