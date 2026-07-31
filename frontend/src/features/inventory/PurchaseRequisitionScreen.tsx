"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import PurchaseRequisitionStats from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionStats";
import PurchaseRequisitionTable from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionTable";
import PurchaseRequisitionCreateDialog from "@/components/dashboard/inventory/purchase/requisition/CreatePurchaseRequisitionDialog";
import PurchaseRequisitionViewDialog from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionViewDialog";
import PurchaseRequisitionApprovalDialog from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionApprovalDialog";
import CreatePurchaseOrderDialog from "@/components/dashboard/inventory/purchase/order/CreatePurchaseOrderDialog";

import { purchaseRequisitions } from "./data/purchaseRequisitionData";
import { PurchaseRequisition } from "./types/purchaseRequisition";

import { indentRequests } from "@/features/inventory/data/indentData";
import { PurchaseOrder } from "./types/purchaseOrder";

export default function PurchaseRequisitionScreen() {
  const { user } = useAuth();

  /*
   * Purchase Requisitions
   */
  const [requisitions, setRequisitions] =
    useState<PurchaseRequisition[]>(
      purchaseRequisitions
    );

  /*
   * Create Dialog
   */
  const [createOpen, setCreateOpen] =
    useState(false);

  /*
   * View Dialog
   */
  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedRequisition, setSelectedRequisition] =
    useState<PurchaseRequisition | null>(null);

  /*
   * Approval Dialog
   */
  const [approvalOpen, setApprovalOpen] =
    useState(false);

  const [approvalRequisition, setApprovalRequisition] =
    useState<PurchaseRequisition | null>(null);

  /*
   * Edit Dialog
   */
  const [editOpen, setEditOpen] =
    useState(false);

  const [editRequisition, setEditRequisition] =
    useState<PurchaseRequisition | null>(null);

  /*
   * VIEW
   */
  const handleView = (
    requisition: PurchaseRequisition
  ) => {
    setSelectedRequisition(requisition);
    setViewOpen(true);
  };

  /*
   * APPROVAL
   */
  const handleApproval = (
    requisition: PurchaseRequisition
  ) => {
    setApprovalRequisition(requisition);
    setApprovalOpen(true);
  };

  /*
   * EDIT
   */
  const handleEdit = (
    requisition: PurchaseRequisition
  ) => {
    setEditRequisition(requisition);
    setEditOpen(true);
  };


  const [poOpen, setPoOpen] = useState(false);

const [poRequisition, setPoRequisition] =
  useState<PurchaseRequisition | null>(null);

const [purchaseOrders, setPurchaseOrders] =
  useState<PurchaseOrder[]>([]);

  const handleCreatePO = (
  requisition: PurchaseRequisition
) => {
  setPoRequisition(requisition);
  setPoOpen(true);
};


  /*
   * LINK INDENT → PURCHASE REQUISITION
   *
   * Once an approved indent is converted
   * into a PR, we remember that connection.
   */
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

  /*
   * APPROVE
   */
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

  /*
   * REJECT
   */
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

  /*
   * SEND BACK
   */
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

  /*
   * SAVE CREATE / EDIT
   *
   * If the PR already exists,
   * replace it.
   *
   * Otherwise add a new PR.
   */
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

      return [requisition, ...prev];
    });

    /*
     * Close edit mode
     */
    setEditOpen(false);
    setEditRequisition(null);

    /*
     * Close create mode
     */
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome,{" "}
            {user?.name ??
              "Inventory Manager"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage purchase requisitions
            generated from department indents.
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

      {/* ================= STATS ================= */}

      <PurchaseRequisitionStats
        requisitions={requisitions}
      />

      {/* ================= TABLE ================= */}

      <section>

        <div className="surface-card overflow-hidden p-5">

          <PurchaseRequisitionTable
            requisitions={requisitions}
            onView={handleView}
            onApproval={handleApproval}
            onEdit={handleEdit}
            onCreatePO={handleCreatePO}
          />

        </div>

      </section>

      {/* ================= CREATE DIALOG ================= */}

      <PurchaseRequisitionCreateDialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
        onSave={handleSaveRequisition}
        onIndentLinked={
          handleIndentLinked
        }
      />

      {/* ================= EDIT DIALOG ================= */}

      <PurchaseRequisitionCreateDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditRequisition(null);
        }}
        onSave={handleSaveRequisition}
        onIndentLinked={
          handleIndentLinked
        }
        editRequisition={
          editRequisition
        }
      />

      {/* ================= VIEW DIALOG ================= */}

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

      {/* ================= APPROVAL DIALOG ================= */}

      <PurchaseRequisitionApprovalDialog
        open={approvalOpen}
        requisition={
          approvalRequisition
        }
        onClose={() => {
          setApprovalOpen(false);
          setApprovalRequisition(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onSendBack={handleSendBack}
      />


      <CreatePurchaseOrderDialog
  open={poOpen}
  requisition={poRequisition}
  onClose={() => {
    setPoOpen(false);
    setPoRequisition(null);
  }}
  onSave={(purchaseOrder) => {
    setPurchaseOrders((prev) => [
      purchaseOrder,
      ...prev,
    ]);

    /*
     * Once PO is created,
     * PR becomes Converted to PO.
     */
    if (poRequisition) {
      setRequisitions((prev) =>
        prev.map((item) =>
          item.id === poRequisition.id
            ? {
                ...item,
                status: "Converted to PO",
              }
            : item
        )
      );
    }

    setPoOpen(false);
    setPoRequisition(null);
  }}
/>

    </div>
  );
}

