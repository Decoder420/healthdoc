"use client";

import { useState } from "react";

import PurchaseOrderTable from "@/components/dashboard/inventory/purchase/order/PurchaseOrderTable";

import PurchaseOrderViewDialog from "@/components/dashboard/inventory/purchase/order/PurchaseOrderViewDialog";

import CreateGRNDialog, {
  CreateGRNData,
} from "@/components/dashboard/inventory/purchase/order/CreateGRNDialog";

import {
  purchaseOrders as initialPurchaseOrders,
  savePurchaseOrders,
} from "./data/purchaseOrderData";

import {
  createGRN,
} from "./data/grnData";

import type { PurchaseOrder } from "./types/purchaseOrder";

import type { GRN } from "./types/grn";

export default function PurchaseOrderScreen() {

  /*
   * ============================================================
   * PURCHASE ORDERS
   * ============================================================
   */

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(
      initialPurchaseOrders
    );

  /*
   * ============================================================
   * CREATE GRN
   * ============================================================
   */

  const [
    selectedPurchaseOrder,
    setSelectedPurchaseOrder,
  ] = useState<PurchaseOrder | null>(null);

  const [
    createGRNOpen,
    setCreateGRNOpen,
  ] = useState(false);

  /*
   * ============================================================
   * VIEW PURCHASE ORDER
   * ============================================================
   */

  const [
    viewPurchaseOrder,
    setViewPurchaseOrder,
  ] = useState<PurchaseOrder | null>(null);

  /*
   * ============================================================
   * VIEW
   * ============================================================
   */

  const handleView = (
    purchaseOrder: PurchaseOrder
  ) => {
    setViewPurchaseOrder(
      purchaseOrder
    );
  };

  /*
   * ============================================================
   * APPROVE
   * ============================================================
   */

  const handleApprove = (
    purchaseOrder: PurchaseOrder
  ) => {

    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,

      status: "Approved",

      approvedBy: "Inventory Manager",

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

    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,

      status: "Sent to Supplier",
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
   * OPEN CREATE GRN
   * ============================================================
   */

  const handleOpenCreateGRN = (
    purchaseOrder: PurchaseOrder
  ) => {

    setSelectedPurchaseOrder(
      purchaseOrder
    );

    setCreateGRNOpen(true);
  };

  /*
   * ============================================================
   * CREATE GRN
   * ============================================================
   */

  const handleCreateGRN = (
    data: CreateGRNData
  ) => {

    if (!selectedPurchaseOrder) {
      return;
    }

    /*
     * ----------------------------------------------------------
     * GENERATE GRN IDENTIFIERS
     * ----------------------------------------------------------
     */

    const timestamp =
      Date.now();

    const grnId =
      `GRN-${timestamp}`;

    const grnNumber =
      `GRN-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${timestamp
        .toString()
        .slice(-4)}`;

    /*
     * ----------------------------------------------------------
     * CREATE GRN OBJECT
     * ----------------------------------------------------------
     */

    const grn: GRN = {

      id: grnId,

      grnNumber,

      purchaseOrderId:
        selectedPurchaseOrder.id,

      poNumber:
        selectedPurchaseOrder.poNumber,

      requisitionNumber:
        selectedPurchaseOrder.requisitionNumber,

      supplierId:
        selectedPurchaseOrder.supplierId ?? "",

      supplierName:
        selectedPurchaseOrder.supplierName,

      invoiceNumber:
        data.supplierInvoiceNumber,

      receivedDate:
        data.receivedDate,

      /*
       * According to your current frontend
       * GRNStatus:
       *
       * draft
       * received
       * verified
       * cancelled
       */

      status: "received",

      /*
       * --------------------------------------------------------
       * GRN ITEMS
       * --------------------------------------------------------
       */

      grnItems:
        data.items.map(
          (item, index) => ({

            id:
              `${grnId}-ITEM-${index + 1}`,

            grnId,

            itemId:
              item.itemId,

            itemName:
              item.itemName,

            batchNumber:
              item.batchNumber,

            expiryDate:
              item.expiryDate,

            quantity:
              item.quantity,

            unitPrice:
              item.unitPrice,

            amount:
              item.quantity *
              item.unitPrice,

          })
        ),

      /*
       * --------------------------------------------------------
       * TOTALS
       * --------------------------------------------------------
       */

      totalItems:
        data.items.length,

      totalQuantity:
        data.items.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        ),

      createdAt:
        new Date().toISOString(),

      receivedBy:
        "Inventory Manager",

      remarks:
        "Goods received against purchase order.",
    };

    /*
     * ----------------------------------------------------------
     * SAVE GRN
     * ----------------------------------------------------------
     */

    createGRN(grn);

    /*
     * ----------------------------------------------------------
     * UPDATE PURCHASE ORDER
     * ----------------------------------------------------------
     */

    const updatedOrders =
      purchaseOrders.map((po) => {

        /*
         * This is not the selected PO.
         */

        if (
          po.id !==
          selectedPurchaseOrder.id
        ) {
          return po;
        }

        /*
         * Update every PO item.
         */

        const updatedItems =
          po.purchaseOrderItems.map(
            (poItem) => {

              const grnItem =
                data.items.find(
                  (item) =>
                    item.itemId ===
                    poItem.itemId
                );

              /*
               * Item was not received.
               */

              if (!grnItem) {
                return poItem;
              }

              /*
               * Add current GRN quantity
               * to previously received quantity.
               */

              return {
                ...poItem,

                receivedQuantity:
                  (poItem.receivedQuantity ?? 0) +
                  grnItem.quantity,
              };
            }
          );

        /*
         * ------------------------------------------------------
         * TOTAL ORDERED
         * ------------------------------------------------------
         */

        const totalOrdered =
          updatedItems.reduce(
            (sum, item) =>
              sum +
              item.orderedQuantity,
            0
          );

        /*
         * ------------------------------------------------------
         * TOTAL RECEIVED
         * ------------------------------------------------------
         */

        const totalReceived =
          updatedItems.reduce(
            (sum, item) =>
              sum +
              (item.receivedQuantity ?? 0),
            0
          );

        /*
         * ------------------------------------------------------
         * PO STATUS
         * ------------------------------------------------------
         */

        const status: PurchaseOrder["status"] =
          totalReceived >= totalOrdered
            ? "Fully Received"
            : "Partially Received";

        return {
          ...po,

          purchaseOrderItems:
            updatedItems,

          status,
        };
      });

    /*
     * ----------------------------------------------------------
     * UPDATE STATE
     * ----------------------------------------------------------
     */

    setPurchaseOrders(
      updatedOrders
    );

    /*
     * ----------------------------------------------------------
     * SAVE PO DATA
     * ----------------------------------------------------------
     */

    savePurchaseOrders(
      updatedOrders
    );

    /*
     * ----------------------------------------------------------
     * CLOSE DIALOG
     * ----------------------------------------------------------
     */

    setCreateGRNOpen(false);

    setSelectedPurchaseOrder(
      null
    );

    /*
     * ----------------------------------------------------------
     * SUCCESS
     * ----------------------------------------------------------
     */

    alert(
      `${grn.grnNumber} created successfully.`
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

            purchaseOrders={
              purchaseOrders
            }

            onView={
              handleView
            }

            onApprove={
              handleApprove
            }

            onSendToSupplier={
              handleSendToSupplier
            }

            onCreateGRN={
              handleOpenCreateGRN
            }

            onCancel={
              handleCancel
            }

          />

        </div>

      </section>

      {/* ======================================================
          CREATE GRN
          ====================================================== */}

      <CreateGRNDialog

        open={
          createGRNOpen
        }

        purchaseOrder={
          selectedPurchaseOrder
        }

        onClose={() => {

          setCreateGRNOpen(false);

          setSelectedPurchaseOrder(
            null
          );

        }}

        onCreate={
          handleCreateGRN
        }

      />

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