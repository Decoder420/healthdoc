"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
   Button,
} from "@mui/material";

import { ShieldCheck } from "lucide-react";

import PhysicalVerificationStats from "@/components/dashboard/inventory/Audit/PhysicalVerification/PhysicalVerificationStats";

import PhysicalVerificationFilters, {
  type PhysicalVerificationFilterValues,
} from "@/components/dashboard/inventory/Audit/PhysicalVerification/PhysicalVerificationFilters";

import PhysicalVerificationTable from "@/components/dashboard/inventory/Audit/PhysicalVerification/PhysicalVerificationTable";

import PhysicalVerificationDialog from "@/components/dashboard/inventory/Audit/PhysicalVerification/PhysicalVerificationDialog";

import StockAdjustmentApproval from "@/components/dashboard/inventory/Audit/StockLedger/StockAdjustmentApproval";

import {
  getPhysicalVerifications,
  savePhysicalVerifications,
} from "@/features/inventory/data/physicalVerificationData";

import type {
  PhysicalVerificationItem,
} from "@/features/inventory/types/physicalVerification";

import {
  getStockAdjustments,
  createStockAdjustment,
  generateAdjustmentId,
} from "@/features/inventory/data/stockAdjustmentData";

import type { StockAdjustment } from "@/features/inventory/types/stockAdjustment";

import CreateAdjustmentDialog from "@/components/dashboard/inventory/Audit/PhysicalVerification/CreateAdjustmentDialog";


const initialFilters: PhysicalVerificationFilterValues = {
  search: "",
  status: "",
  result: "",
};

export default function PhysicalVerificationScreen() {
  const [items, setItems] =
    useState<PhysicalVerificationItem[]>([]);

  const [filters, setFilters] =
    useState<PhysicalVerificationFilterValues>(
      initialFilters
    );

  const [selectedVerification, setSelectedVerification] =
    useState<PhysicalVerificationItem | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [readOnly, setReadOnly] =
    useState(false);

    const [
  adjustmentVerification,
  setAdjustmentVerification,
] =
  useState<PhysicalVerificationItem | null>(
    null
  );

const [approvalDialogOpen, setApprovalDialogOpen] =
  useState(false);

const [
  adjustmentDialogOpen,
  setAdjustmentDialogOpen,
] = useState(false);

  useEffect(() => {
    setItems(getPhysicalVerifications());
  }, []);

  const filteredItems = useMemo(() => {
    const search =
      filters.search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.id.toLowerCase().includes(search) ||
        item.item_id.toLowerCase().includes(search) ||
        item.item_name
          .toLowerCase()
          .includes(search) ||
        item.batch_id
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        !filters.status ||
        item.status === filters.status;

      const matchesResult =
        !filters.result ||
        item.result === filters.result;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesResult
      );
    });
  }, [items, filters]);

  const stats = useMemo(() => {
    return {
      total: items.length,

      pending: items.filter(
        (item) => item.status === "Pending"
      ).length,

      completed: items.filter(
        (item) => item.status === "Completed"
      ).length,

      variances: items.filter(
        (item) => item.result === "Variance Found"
      ).length,
    };
  }, [items]);

  const handleStart = (
    verification: PhysicalVerificationItem
  ) => {
    setSelectedVerification(verification);
    setReadOnly(false);
    setDialogOpen(true);
  };

  const handleCreateAdjustment = (
  verification: PhysicalVerificationItem
) => {
  setAdjustmentVerification(
    verification
  );

  setAdjustmentDialogOpen(true);
};

  const handleView = (
    verification: PhysicalVerificationItem
  ) => {
    setSelectedVerification(verification);
    setReadOnly(true);
    setDialogOpen(true);
  };

  const handleSave = (
    verificationId: string,
    physicalQuantity: number,
    remarks: string
  ) => {
    const updated = items.map((item) => {
      if (item.id !== verificationId) {
        return item;
      }

      const variance =
        physicalQuantity -
        item.system_quantity;

      return {
        ...item,

        physical_quantity:
          physicalQuantity,

        variance,

        result:
          variance === 0
            ? ("Matched" as const)
            : ("Variance Found" as const),

        status: "Completed",

        verified_by: "USR-005",

        verified_at:
          new Date().toISOString(),

        remarks,
      } as PhysicalVerificationItem;
    });

    savePhysicalVerifications(updated);

    setItems(updated);

    setDialogOpen(false);
    setSelectedVerification(null);
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Physical Verification
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Compare physical stock with system
          inventory and identify variances.
        </Typography>
      </Box>

  <Button
    variant="outlined"
    startIcon={<ShieldCheck size={18} />}
    onClick={() => setApprovalDialogOpen(true)}
  >
    Dual Sign-off
  </Button>    

      <PhysicalVerificationStats
        {...stats}
      />

      <PhysicalVerificationFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />

      <PhysicalVerificationTable
        items={filteredItems}
        onStart={handleStart}
        onView={handleView}
        onCreateAdjustment={handleCreateAdjustment}
      />

      <PhysicalVerificationDialog
        open={dialogOpen}
        verification={selectedVerification}
        readOnly={readOnly}
        onClose={() => {
          setDialogOpen(false);
          setSelectedVerification(null);
        }}
        onSave={handleSave}
      />


<StockAdjustmentApproval
  open={approvalDialogOpen}
  onClose={() => setApprovalDialogOpen(false)}
  onUpdated={() => {
    setItems(getPhysicalVerifications());
  }}
/>

<CreateAdjustmentDialog
  open={adjustmentDialogOpen}
  verification={adjustmentVerification}
  onClose={() => {
    setAdjustmentDialogOpen(false);
    setAdjustmentVerification(null);
  }}
  onSubmit={(verification, reason) => {
  const adjustmentQuantity =
    verification.variance ?? 0;

  if (adjustmentQuantity === 0) {
    return;
  }

  const existingAdjustments =
    getStockAdjustments();

  const alreadyCreated =
    existingAdjustments.some(
      (adjustment) =>
        adjustment.reason.includes(
          verification.id
        )
    );

  if (alreadyCreated) {
    setAdjustmentDialogOpen(false);
    setAdjustmentVerification(null);
    return;
  }

const adjustment: StockAdjustment = {
  id: generateAdjustmentId(),

  item_id: verification.item_id,

  batch_id:
    verification.batch_id ?? null,

  system_quantity:
    verification.system_quantity,

  physical_quantity:
    verification.physical_quantity ?? 0,

  adjustment_quantity:
    adjustmentQuantity,

  reason: `${reason} (${verification.id})`,

  requested_by: "USR-005",

  requested_at:
    new Date().toISOString(),

  status: "Pending Approval",

  first_approved_by: null,
  first_approved_at: null,

  second_approved_by: null,
  second_approved_at: null,

  rejection_reason: null,
};

createStockAdjustment(adjustment);

  setAdjustmentDialogOpen(false);
  setAdjustmentVerification(null);
}}
/>

    </Box>
  );
}