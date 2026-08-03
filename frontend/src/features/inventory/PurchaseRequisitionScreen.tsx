"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import PurchaseRequisitionStats from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionStats";
import PurchaseRequisitionTable from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionTable";
import PurchaseRequisitionCreateDialog from "@/components/dashboard/inventory/purchase/requisition/CreatePurchaseRequisitionDialog";
import PurchaseRequisitionViewDialog from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionViewDialog";
import PurchaseRequisitionApprovalDialog from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionApprovalDialog";


import { purchaseRequisitions } from "./data/purchaseRequisitionData";
import { PurchaseRequisition } from "./types/purchaseRequisition";

import { indentRequests } from "@/features/inventory/data/indentData";
import { PurchaseOrder } from "./types/purchaseOrder";
import {
  addPurchaseOrder,
} from "./data/purchaseOrderData";


type Filter =
  | "All"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Sent Back"
  | "Converted to PO";

export default function PurchaseRequisitionScreen() {
  const { user } = useAuth();

  const [requisitions, setRequisitions] =
    useState<PurchaseRequisition[]>(
      purchaseRequisitions
    );

  

  /* CREATE */

  const [createOpen, setCreateOpen] =
    useState(false);

  /* VIEW */

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedRequisition, setSelectedRequisition] =
    useState<PurchaseRequisition | null>(null);

  /* APPROVAL */

  const [approvalOpen, setApprovalOpen] =
    useState(false);

  const [approvalRequisition, setApprovalRequisition] =
    useState<PurchaseRequisition | null>(null);

  /* EDIT */

  const [editOpen, setEditOpen] =
    useState(false);

  const [editRequisition, setEditRequisition] =
    useState<PurchaseRequisition | null>(null);

  /* PURCHASE ORDER */

 

  /* FILTER */

  const [filter, setFilter] =
    useState<Filter>("All");

  /* -----------------------------------------
     VIEW
  ----------------------------------------- */

  const handleView = (
    requisition: PurchaseRequisition
  ) => {
    setSelectedRequisition(requisition);
    setViewOpen(true);
  };

  /* -----------------------------------------
     APPROVAL
  ----------------------------------------- */

  const handleApproval = (
    requisition: PurchaseRequisition
  ) => {
    setApprovalRequisition(requisition);
    setApprovalOpen(true);
  };

  /* -----------------------------------------
     EDIT
  ----------------------------------------- */

  const handleEdit = (
    requisition: PurchaseRequisition
  ) => {
    setEditRequisition(requisition);
    setEditOpen(true);
  };

  /* -----------------------------------------
     CREATE PO
  ----------------------------------------- */


  
  
  /* -----------------------------------------
     LINK INDENT
  ----------------------------------------- */

  const handleIndentLinked = (
    indentId: string,
    requisitionId: string,
    requisitionNumber: string
  ) => {
    const indent = indentRequests.find(
      (item) => item.id === indentId
    );

    if (!indent) return;

    indent.purchaseRequisitionId =
      requisitionId;

    indent.purchaseRequisitionNumber =
      requisitionNumber;
  };

  /* -----------------------------------------
     APPROVE
  ----------------------------------------- */

  const handleApprove = (
    requisition: PurchaseRequisition,
    comment: string
  ) => {
    setRequisitions((prev) =>
      prev.map((item) =>
        item.id === requisition.id
          ? {
              ...item,
              status: "Approved",
              approvalStatus: "Approved",
              approvalComment: comment,
              approvedBy:
                user?.name ??
                "Inventory Manager",
              approvedAt:
                new Date().toLocaleDateString(),
            }
          : item
      )
    );

    setApprovalOpen(false);
    setApprovalRequisition(null);
  };

  /* -----------------------------------------
     REJECT
  ----------------------------------------- */

  const handleReject = (
    requisition: PurchaseRequisition,
    reason: string
  ) => {
    setRequisitions((prev) =>
      prev.map((item) =>
        item.id === requisition.id
          ? {
              ...item,
              status: "Rejected",
              approvalStatus: "Rejected",
              rejectionReason: reason,
              approvalComment: reason,
            }
          : item
      )
    );

    setApprovalOpen(false);
    setApprovalRequisition(null);
  };

  /* -----------------------------------------
     SEND BACK
  ----------------------------------------- */

  const handleSendBack = (
    requisition: PurchaseRequisition,
    reason: string
  ) => {
    setRequisitions((prev) =>
      prev.map((item) =>
        item.id === requisition.id
          ? {
              ...item,
              status: "Sent Back",
              approvalStatus: "Sent Back",
              sentBackReason: reason,
              approvalComment: reason,
            }
          : item
      )
    );

    setApprovalOpen(false);
    setApprovalRequisition(null);
  };

  /* -----------------------------------------
     SAVE REQUISITION
  ----------------------------------------- */

  const handleSaveRequisition = (
    requisition: PurchaseRequisition
  ) => {
    setRequisitions((prev) => {
      const exists = prev.some(
        (item) => item.id === requisition.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === requisition.id
            ? requisition
            : item
        );
      }

      return [
        requisition,
        ...prev,
      ];
    });

    setEditOpen(false);
    setEditRequisition(null);
    setCreateOpen(false);
  };

  /* -----------------------------------------
     CREATE PO
  ----------------------------------------- */

  const handleCreatePO = (
  requisition: PurchaseRequisition
) => {
  if (requisition.status !== "Approved") {
    return;
  }

  const orderItems =
    requisition.requisitionItems.map((item) => {
      const unitRate =
        item.estimatedRate ?? 0;

      const amount =
        item.quantity * unitRate;

      return {
        id: crypto.randomUUID(),

        itemId: item.itemId,

        itemName: item.itemName,

        orderedQuantity: item.quantity,

        unitRate,

        taxPercent: 0,

        discount: 0,

        amount,

        receivedQuantity: 0,
      };
    });

  const subtotal =
    orderItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

  const totalQuantity =
    orderItems.reduce(
      (sum, item) =>
        sum + item.orderedQuantity,
      0
    );

  const purchaseOrder: PurchaseOrder = {
    id: crypto.randomUUID(),

    poNumber: `PO-${Date.now()}`,

    purchaseRequisitionId:
      requisition.id,

    requisitionNumber:
      requisition.requisitionNumber,

    supplierId:
      requisition.supplierId,

    supplierName:
      requisition.supplierName ??
      "Not Assigned",

    departmentId:
      requisition.departmentId,

    departmentName:
      requisition.departmentName,

    orderDate:
      new Date().toLocaleDateString(),

    status: "Approved",

    items: orderItems.length,

    totalQuantity,

    subtotal,

    taxAmount: 0,

    discountAmount: 0,

    grandTotal: subtotal,

    paymentTerms: "30 Days",

    deliveryTerms:
      "Delivery at Hospital Store",

    remarks:
      requisition.remarks,

    createdBy:
      user?.name ??
      "Inventory Manager",

    createdAt:
      new Date().toLocaleDateString(),

    approvedBy:
      user?.name ??
      "Inventory Manager",

    approvedAt:
      new Date().toLocaleDateString(),

    purchaseOrderItems:
      orderItems,
  };

  // Save PO
  addPurchaseOrder(purchaseOrder);

  // Mark PR as converted
  setRequisitions((prev) =>
    prev.map((item) =>
      item.id === requisition.id
        ? {
            ...item,
            status: "Converted to PO",
          }
        : item
    )
  );

  // Open Purchase Order page
  window.location.href =
    "/inventory/purchase/PurchaseOrder";
};

  /* -----------------------------------------
     COUNTS
  ----------------------------------------- */

  const pendingApproval =
    requisitions.filter(
      (item) =>
        item.status ===
        "Pending Approval"
    );

  const approved =
    requisitions.filter(
      (item) =>
        item.status === "Approved"
    );

  const rejected =
    requisitions.filter(
      (item) =>
        item.status === "Rejected"
    );

  const sentBack =
    requisitions.filter(
      (item) =>
        item.status === "Sent Back"
    );

  const converted =
    requisitions.filter(
      (item) =>
        item.status ===
        "Converted to PO"
    );

  const filteredRequisitions =
    filter === "All"
      ? requisitions
      : requisitions.filter(
          (item) =>
            item.status === filter
        );

  return (
    <div className="space-y-6">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Purchase Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Purchase Requisitions
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage department requirements,
            approvals and purchase order creation.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            setCreateOpen(true)
          }
        >
          Create Requisition
        </button>

      </div>

      
{/* =========================================
    PROCUREMENT PIPELINE
========================================= */}

<section className="surface-card p-5">
  <div className="mb-5">
    <h2 className="text-base font-semibold text-foreground">
      Procurement Pipeline
    </h2>

    <p className="mt-1 text-sm text-muted-foreground">
      Track the progress of department requirements through procurement.
    </p>
  </div>

  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div className="flex flex-1 items-center gap-2">
      <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Department Need
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          Indent Request
        </p>
      </div>

      <span className="text-muted-foreground">→</span>

      <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Current Stage
        </p>
        <p className="mt-1 text-sm font-semibold text-primary">
          Purchase Requisition
        </p>
      </div>

      <span className="text-muted-foreground">→</span>

      <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Next
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          Approval
        </p>
      </div>

      <span className="text-muted-foreground">→</span>

      <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Next
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          Purchase Order
        </p>
      </div>

      <span className="text-muted-foreground">→</span>

      <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Final
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          GRN
        </p>
      </div>
    </div>
  </div>
</section>
     

      {/* =========================================
          NEEDS ATTENTION
      ========================================= */}

      {(pendingApproval.length > 0 ||
        approved.length > 0 ||
        sentBack.length > 0) && (

        <section className="surface-card p-5">

          <div className="mb-4">
            <h2 className="text-base font-semibold">
              Needs Attention
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Requisitions waiting for the next procurement action.
            </p>
          </div>

          <div className="space-y-3">

            {pendingApproval
              .slice(0, 3)
              .map((requisition) => (
                <div
                  key={requisition.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {requisition.requisitionNumber}
                      </span>

                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        Pending Approval
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {requisition.departmentName}
                      {" • "}
                      {requisition.items} items
                    </p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleApproval(requisition)
                    }
                  >
                    Review Request
                  </button>
                </div>
              ))}

            {approved
              .slice(0, 3)
              .map((requisition) => (
                <div
                  key={requisition.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {requisition.requisitionNumber}
                      </span>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Ready for PO
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {requisition.departmentName}
                      {" • "}
                      {requisition.items} items
                    </p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleCreatePO(requisition)
                    }
                  >
                    Create Purchase Order
                  </button>
                </div>
              ))}

            {sentBack
              .slice(0, 3)
              .map((requisition) => (
                <div
                  key={requisition.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {requisition.requisitionNumber}
                      </span>

                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                        Sent Back
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Requires correction before approval.
                    </p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEdit(requisition)
                    }
                  >
                    Update Request
                  </button>
                </div>
              ))}

          </div>
        </section>
      )}

      {/* =========================================
          EXISTING STATS
      ========================================= */}

      <PurchaseRequisitionStats
        requisitions={requisitions}
      />

      {/* =========================================
          FILTERS
      ========================================= */}

      <section className="surface-card p-4">

        <div className="flex flex-wrap gap-2">

          {(
            [
              "All",
              "Pending Approval",
              "Approved",
              "Rejected",
              "Sent Back",
              "Converted to PO",
            ] as Filter[]
          ).map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                filter === item
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {item}
            </button>

          ))}

        </div>
      </section>

      {/* =========================================
          TABLE
      ========================================= */}

      <section>
        <div className="surface-card overflow-hidden p-5">

          <PurchaseRequisitionTable
            requisitions={
              filteredRequisitions
            }
            onView={handleView}
            onApproval={handleApproval}
            onEdit={handleEdit}
            onCreatePO={handleCreatePO}
          />

        </div>
      </section>

      {/* =========================================
          CREATE REQUISITION DIALOG
      ========================================= */}

      <PurchaseRequisitionCreateDialog
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onSave={
          handleSaveRequisition
        }
        onIndentLinked={
          handleIndentLinked
        }
      />

      {/* =========================================
          EDIT REQUISITION DIALOG
      ========================================= */}

      <PurchaseRequisitionCreateDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditRequisition(null);
        }}
        onSave={
          handleSaveRequisition
        }
        onIndentLinked={
          handleIndentLinked
        }
        editRequisition={
          editRequisition
        }
      />

      {/* =========================================
          VIEW DIALOG
      ========================================= */}

      <PurchaseRequisitionViewDialog
        open={viewOpen}
        requisition={
          selectedRequisition
        }
        onClose={() => {
          setViewOpen(false);
          setSelectedRequisition(null);
        }}
      />

      {/* =========================================
          APPROVAL DIALOG
      ========================================= */}

      <PurchaseRequisitionApprovalDialog
        open={approvalOpen}
        requisition={
          approvalRequisition
        }
        onClose={() => {
          setApprovalOpen(false);
          setApprovalRequisition(null);
        }}
        onApprove={
          handleApprove
        }
        onReject={
          handleReject
        }
        onSendBack={
          handleSendBack
        }
      />

    
      

    </div>
  );
}