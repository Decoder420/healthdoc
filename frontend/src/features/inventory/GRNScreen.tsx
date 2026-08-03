
"use client";

import { useState } from "react";

import PurchaseOrderTable from "@/components/dashboard/inventory/purchase/order/PurchaseOrderTable";
import PurchaseOrderViewDialog from "@/components/dashboard/inventory/purchase/order/PurchaseOrderViewDialog";
import GoodsReceivingForm from "@/components/dashboard/inventory/purchase/grn/GoodsReceivingForm";

import {
  purchaseOrders as initialPurchaseOrders,
  savePurchaseOrders,
} from "./data/purchaseOrderData";

import { addGRN } from "./data/grnData";

import { PurchaseOrder } from "./types/purchaseOrder";
import { GRN } from "./types/grn";

export default function PurchaseOrderScreen() {
  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(initialPurchaseOrders);

  /*
   * PO currently opened for receiving
   */
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrder | null>(null);

  /*
   * PO currently opened in View dialog
   */
  const [viewPurchaseOrder, setViewPurchaseOrder] =
    useState<PurchaseOrder | null>(null);

  /*
   * ============================================================
   * VIEW PURCHASE ORDER
   * ============================================================
   */

  const handleView = (purchaseOrder: PurchaseOrder) => {
    setViewPurchaseOrder(purchaseOrder);
  };

  /*
   * ============================================================
   * APPROVE PURCHASE ORDER
   * ============================================================
   */

  const handleApprove = (purchaseOrder: PurchaseOrder) => {
    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,
      status: "Approved",
      approvedBy: "Inventory Manager",
      approvedAt: new Date().toLocaleDateString("en-IN"),
    };

    const updatedOrders = purchaseOrders.map((po) =>
      po.id === purchaseOrder.id
        ? updatedPurchaseOrder
        : po
    );

    setPurchaseOrders(updatedOrders);
    savePurchaseOrders(updatedOrders);
  };

  /*
   * ============================================================
   * SEND TO SUPPLIER
   * ============================================================
   */

  const handleSendToSupplier = (
    purchaseOrder: PurchaseOrder
  ) => {
    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,
      status: "Sent to Supplier",
    };

    const updatedOrders = purchaseOrders.map((po) =>
      po.id === purchaseOrder.id
        ? updatedPurchaseOrder
        : po
    );

    setPurchaseOrders(updatedOrders);
    savePurchaseOrders(updatedOrders);
  };

  /*
   * ============================================================
   * OPEN GOODS RECEIVING FORM
   * ============================================================
   */

  const handleCreateGRN = (
    purchaseOrder: PurchaseOrder
  ) => {
    setSelectedPurchaseOrder(purchaseOrder);
  };

  /*
   * ============================================================
   * SUBMIT GRN
   * ============================================================
   */

  const handleGRNSubmit = (grn: GRN) => {
    /*
     * ----------------------------------------------------------
     * 1. SAVE GRN
     * ----------------------------------------------------------
     */

    addGRN(grn);

    /*
     * ----------------------------------------------------------
     * 2. UPDATE PURCHASE ORDER
     * ----------------------------------------------------------
     */

    const updatedOrders = purchaseOrders.map((po) => {
      /*
       * This is not the PO for this GRN.
       */
      if (po.id !== grn.purchaseOrderId) {
        return po;
      }

      /*
       * Update received quantity item by item.
       */

      const updatedItems =
        po.purchaseOrderItems.map((poItem) => {
          const grnItem = grn.grnItems.find(
            (item) =>
              item.itemId === poItem.itemId
          );

          /*
           * This PO item was not received
           * in the current GRN.
           */
          if (!grnItem) {
            return poItem;
          }

          return {
            ...poItem,

            receivedQuantity:
              (poItem.receivedQuantity ?? 0) +
              grnItem.receivedQuantity,
          };
        });

      /*
       * --------------------------------------------------------
       * Calculate total received
       * --------------------------------------------------------
       */

      const totalReceived =
        updatedItems.reduce(
          (sum, item) =>
            sum +
            (item.receivedQuantity ?? 0),
          0
        );

      /*
       * --------------------------------------------------------
       * Calculate total ordered
       * --------------------------------------------------------
       */

      const totalOrdered =
        updatedItems.reduce(
          (sum, item) =>
            sum +
            item.orderedQuantity,
          0
        );

      /*
       * --------------------------------------------------------
       * Determine PO status
       * --------------------------------------------------------
       *
       * Example:
       *
       * Ordered = 100
       * Received = 40
       * => Partially Received
       *
       * Ordered = 100
       * Received = 100
       * => Fully Received
       */

      let status: PurchaseOrder["status"];

      if (totalReceived >= totalOrdered) {
        status = "Fully Received";
      } else {
        status = "Partially Received";
      }

      return {
        ...po,
        purchaseOrderItems: updatedItems,
        status,
      };
    });

    /*
     * ----------------------------------------------------------
     * 3. UPDATE SCREEN
     * ----------------------------------------------------------
     */

    setPurchaseOrders(updatedOrders);

    /*
     * ----------------------------------------------------------
     * 4. SAVE UPDATED PURCHASE ORDERS
     * ----------------------------------------------------------
     */

    savePurchaseOrders(updatedOrders);

    /*
     * ----------------------------------------------------------
     * 5. CLOSE RECEIVING FORM
     * ----------------------------------------------------------
     */

    setSelectedPurchaseOrder(null);

    /*
     * ----------------------------------------------------------
     * 6. SUCCESS MESSAGE
     * ----------------------------------------------------------
     */

    alert(
      `GRN ${grn.grnNumber} created successfully.`
    );
  };

  /*
   * ============================================================
   * CANCEL PURCHASE ORDER
   * ============================================================
   */

  const handleCancel = (
    purchaseOrder: PurchaseOrder
  ) => {
    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,
      status: "Cancelled",
    };

    const updatedOrders = purchaseOrders.map((po) =>
      po.id === purchaseOrder.id
        ? updatedPurchaseOrder
        : po
    );

    setPurchaseOrders(updatedOrders);
    savePurchaseOrders(updatedOrders);
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

      {!selectedPurchaseOrder && (
        <section>
          <div className="surface-card overflow-hidden p-5">

            <PurchaseOrderTable
              purchaseOrders={purchaseOrders}

              onView={handleView}

              onApprove={handleApprove}

              onSendToSupplier={
                handleSendToSupplier
              }

              onCreateGRN={
                handleCreateGRN
              }

              onCancel={
                handleCancel
              }
            />

          </div>
        </section>
      )}

      {/* ======================================================
          PURCHASE ORDER VIEW DIALOG
          ====================================================== */}

      {viewPurchaseOrder && (
        <PurchaseOrderViewDialog
          open={true}
          purchaseOrder={viewPurchaseOrder}
          onClose={() =>
            setViewPurchaseOrder(null)
          }
        />
      )}

      {/* ======================================================
          GOODS RECEIVING FORM
          ====================================================== */}

      {selectedPurchaseOrder && (
        <section>
          <div className="surface-card p-5">

            <GoodsReceivingForm
              purchaseOrder={
                selectedPurchaseOrder
              }

              onCancel={() =>
                setSelectedPurchaseOrder(null)
              }

              onSubmit={
                handleGRNSubmit
              }
            />

          </div>
        </section>
      )}

    </div>
  );
}

