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

import CreateAdjustmentDialog from "@/components/dashboard/inventory/Audit/PhysicalVerification/CreateAdjustmentDialog";

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

import type {
  StockAdjustment,
} from "@/features/inventory/types/stockAdjustment";


const initialFilters: PhysicalVerificationFilterValues = {
  search: "",
  status: "",
  result: "",
};


export default function PhysicalVerificationScreen() {

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

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
  ] = useState<PhysicalVerificationItem | null>(null);

  const [
    adjustmentDialogOpen,
    setAdjustmentDialogOpen,
  ] = useState(false);

  const [
    approvalDialogOpen,
    setApprovalDialogOpen,
  ] = useState(false);


  /*
   * ============================================================
   * LOAD DATA
   * ============================================================
   */

  const loadPhysicalVerifications = () => {

    try {

      const data =
        getPhysicalVerifications();

      setItems(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load physical verifications:",
        error
      );

      setItems([]);

    }
  };


  useEffect(() => {

    loadPhysicalVerifications();

    const handleVerificationUpdate = () => {
      loadPhysicalVerifications();
    };

    const handleAdjustmentUpdate = () => {
      loadPhysicalVerifications();
    };

    window.addEventListener(
      "physical-verification-updated",
      handleVerificationUpdate
    );

    window.addEventListener(
      "stock-adjustment-updated",
      handleAdjustmentUpdate
    );

    return () => {

      window.removeEventListener(
        "physical-verification-updated",
        handleVerificationUpdate
      );

      window.removeEventListener(
        "stock-adjustment-updated",
        handleAdjustmentUpdate
      );

    };

  }, []);


  /*
   * ============================================================
   * FILTER DATA
   * ============================================================
   */

  const filteredItems =
    useMemo<PhysicalVerificationItem[]>(() => {

      const search =
        filters.search
          .toLowerCase()
          .trim();

      return items.filter((item) => {

        const matchesSearch =
          !search ||
          item.id
            .toLowerCase()
            .includes(search) ||
          item.item_id
            .toLowerCase()
            .includes(search) ||
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


  /*
   * ============================================================
   * STATS
   * ============================================================
   */

  const stats = useMemo(() => {

    return {

      total:
        items.length,

      pending:
        items.filter(
          (item) =>
            item.status === "Pending"
        ).length,

      completed:
        items.filter(
          (item) =>
            item.status === "Completed"
        ).length,

      variances:
        items.filter(
          (item) =>
            item.result === "Variance Found"
        ).length,

    };

  }, [items]);


  /*
   * ============================================================
   * START VERIFICATION
   * ============================================================
   */

  const handleStart = (
    verification: PhysicalVerificationItem
  ) => {

    setSelectedVerification(
      verification
    );

    setReadOnly(false);

    setDialogOpen(true);
  };


  /*
   * ============================================================
   * VIEW VERIFICATION
   * ============================================================
   */

  const handleView = (
    verification: PhysicalVerificationItem
  ) => {

    setSelectedVerification(
      verification
    );

    setReadOnly(true);

    setDialogOpen(true);
  };


  /*
   * ============================================================
   * CLOSE VERIFICATION DIALOG
   * ============================================================
   */

  const handleCloseVerificationDialog = () => {

    setDialogOpen(false);

    setSelectedVerification(null);

    setReadOnly(false);
  };


  /*
   * ============================================================
   * CREATE ADJUSTMENT
   * ============================================================
   */

  const handleCreateAdjustment = (
    verification: PhysicalVerificationItem
  ) => {

    const variance =
      verification.variance ?? 0;

    if (variance === 0) {

      console.warn(
        "Cannot create adjustment because variance is 0."
      );

      return;
    }

    setAdjustmentVerification(
      verification
    );

    setAdjustmentDialogOpen(
      true
    );
  };


  /*
   * ============================================================
   * SAVE PHYSICAL VERIFICATION
   * ============================================================
   */

  const handleSave = (
    verificationId: string,
    physicalQuantity: number,
    remarks: string
  ) => {

    const updated =
      items.map((item) => {

        if (
          item.id !== verificationId
        ) {
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

          status:
            "Completed",

          verified_by:
            "USR-005",

          verified_at:
            new Date().toISOString(),

          remarks,

        } as PhysicalVerificationItem;

      });


    savePhysicalVerifications(
      updated
    );

    setItems(updated);

    setDialogOpen(false);

    setSelectedVerification(
      null
    );

    setReadOnly(false);


    window.dispatchEvent(
      new Event(
        "physical-verification-updated"
      )
    );

  };


  /*
   * ============================================================
   * SUBMIT STOCK ADJUSTMENT
   * ============================================================
   */

  const handleSubmitAdjustment = (
    verification: PhysicalVerificationItem,
    reason: string
  ) => {

    try {

      const adjustmentQuantity =
        verification.variance ?? 0;


      /*
       * VALIDATE VARIANCE
       */

      if (
        adjustmentQuantity === 0
      ) {

        console.warn(
          "Cannot create adjustment with zero variance."
        );

        return;
      }


      /*
       * LOAD EXISTING ADJUSTMENTS
       */

      const existing =
        getStockAdjustments();


      /*
       * PREVENT DUPLICATE ACTIVE ADJUSTMENT
       */

      const duplicate =
        existing.find(
          (item) =>
            item.reason?.includes(
              `(${verification.id})`
            ) &&
            (
              item.status ===
                "Pending Approval" ||
              item.status ===
                "First Approved"
            )
        );


      if (duplicate) {

        console.warn(
          "Adjustment already exists:",
          duplicate
        );

        setAdjustmentDialogOpen(
          false
        );

        setAdjustmentVerification(
          null
        );

        window.dispatchEvent(
          new Event(
            "stock-adjustment-updated"
          )
        );

        return;
      }


      /*
       * CREATE ADJUSTMENT
       */

      const adjustment:
        StockAdjustment = {

        id:
          generateAdjustmentId(),

        item_id:
          verification.item_id,

        batch_id:
          verification.batch_id ??
          null,

        system_quantity:
          verification.system_quantity,

        physical_quantity:
          verification.physical_quantity ??
          0,

        adjustment_quantity:
          adjustmentQuantity,

        reason:
          `${reason} (${verification.id})`,

        requested_by:
          "USR-005",

        requested_at:
          new Date().toISOString(),

        status:
          "Pending Approval",

        first_approved_by:
          null,

        first_approved_at:
          null,

        second_approved_by:
          null,

        second_approved_at:
          null,

        rejection_reason:
          null,
      };


      console.log(
        "CREATING STOCK ADJUSTMENT:",
        adjustment
      );


      /*
       * SAVE
       */

      createStockAdjustment(
        adjustment
      );


      /*
       * VERIFY SAVE
       */

      const savedAdjustments =
        getStockAdjustments();

      const savedAdjustment =
        savedAdjustments.find(
          (item) =>
            item.id ===
            adjustment.id
        );


      if (!savedAdjustment) {

        throw new Error(
          "Stock adjustment was not saved."
        );

      }


      console.log(
        "STOCK ADJUSTMENT SAVED:",
        savedAdjustment
      );


      /*
       * NOTIFY OTHER COMPONENTS
       */

      window.dispatchEvent(
        new Event(
          "stock-adjustment-updated"
        )
      );


      /*
       * CLOSE CREATE DIALOG
       */

      setAdjustmentDialogOpen(
        false
      );

      setAdjustmentVerification(
        null
      );


      /*
       * OPEN DUAL SIGN-OFF
       */

      setTimeout(() => {

        setApprovalDialogOpen(
          true
        );

      }, 150);

    } catch (error) {

      console.error(
        "CREATE STOCK ADJUSTMENT ERROR:",
        error
      );

    }
  };


  /*
   * ============================================================
   * RESET FILTERS
   * ============================================================
   */

  const handleReset = () => {

    setFilters(
      initialFilters
    );

  };


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (

    <Box>

      {/* HEADER */}

      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >

        <Box>

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
          startIcon={
            <ShieldCheck size={18} />
          }
          onClick={() =>
            setApprovalDialogOpen(
              true
            )
          }
        >
          Dual Sign-off
        </Button>

      </Box>


      {/* STATS */}

      <PhysicalVerificationStats
        {...stats}
      />


      {/* FILTERS */}

      <PhysicalVerificationFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />


      {/* TABLE */}

      <PhysicalVerificationTable
        items={filteredItems ?? []}
        onStart={handleStart}
        onView={handleView}
        onCreateAdjustment={
          handleCreateAdjustment
        }
      />


      {/* VERIFICATION DIALOG */}

      <PhysicalVerificationDialog
        open={dialogOpen}
        verification={
          selectedVerification
        }
        readOnly={readOnly}
        onClose={
          handleCloseVerificationDialog
        }
        onSave={handleSave}
      />


      {/* DUAL SIGN-OFF */}

      <StockAdjustmentApproval
        open={approvalDialogOpen}
        onClose={() =>
          setApprovalDialogOpen(
            false
          )
        }
        onUpdated={() => {

          loadPhysicalVerifications();

          window.dispatchEvent(
            new Event(
              "stock-adjustment-updated"
            )
          );

        }}
      />


      {/* CREATE STOCK ADJUSTMENT */}

      <CreateAdjustmentDialog
        open={adjustmentDialogOpen}
        verification={
          adjustmentVerification
        }
        onClose={() => {

          setAdjustmentDialogOpen(
            false
          );

          setAdjustmentVerification(
            null
          );

        }}
        onSubmit={
          handleSubmitAdjustment
        }
      />

    </Box>
  );
}