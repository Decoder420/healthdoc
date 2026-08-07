import type { StockAdjustment } from "../types/stockAdjustment";

import {
  createStockTransaction,
  generateTransactionId,
  getStockTransactions,
} from "./stockTransactionData";

const STORAGE_KEY = "hospital_stock_adjustments";

export const getStockAdjustments = (): StockAdjustment[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as StockAdjustment[];
  } catch {
    return [];
  }
};

export const saveStockAdjustments = (
  adjustments: StockAdjustment[]
) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(adjustments)
  );
};

export const generateAdjustmentId = () => {
  return `ADJ-${Date.now()}`;
};

export const createStockAdjustment = (
  adjustment: StockAdjustment
): StockAdjustment => {
  const existing = getStockAdjustments();

  saveStockAdjustments([
    ...existing,
    adjustment,
  ]);

  return adjustment;
};

export const approveStockAdjustment = (
  adjustmentId: string,
  userId: string
) => {
  const adjustments = getStockAdjustments();

  const index = adjustments.findIndex(
    (adjustment) =>
      adjustment.id === adjustmentId
  );

  if (index === -1) {
    throw new Error(
      "Stock adjustment not found."
    );
  }

  const adjustment = adjustments[index];

  /*
   * FIRST APPROVAL
   *
   * Pending Approval
   *       ↓
   * First Approved
   */
  if (adjustment.status === "Pending Approval") {
    adjustments[index] = {
      ...adjustment,

      status: "First Approved",

      first_approved_by: userId,

      first_approved_at:
        new Date().toISOString(),
    };

    saveStockAdjustments(adjustments);

    return adjustments[index];
  }

  /*
   * FINAL APPROVAL
   *
   * First Approved
   *       ↓
   * Different User
   *       ↓
   * Approved
   */
  if (adjustment.status === "First Approved") {
    if (
      adjustment.first_approved_by === userId
    ) {
      throw new Error(
        "A different authorized user must complete the final approval."
      );
    }

    const approvedAt =
      new Date().toISOString();

    adjustments[index] = {
      ...adjustment,

      status: "Approved",

      second_approved_by: userId,

      second_approved_at: approvedAt,
    };

    saveStockAdjustments(adjustments);

    /*
     * Create the inventory transaction
     * ONLY after final approval.
     */
    const existingTransactions =
      getStockTransactions();

    const alreadyRecorded =
      existingTransactions.some(
        (transaction) =>
          transaction.reference_type ===
            "STOCK_ADJUSTMENT" &&
          transaction.reference_id ===
            adjustment.id
      );

    if (!alreadyRecorded) {
      createStockTransaction({
        id: generateTransactionId(),

        item_id:
          adjustment.item_id,

        /*
         * StockAdjustment currently doesn't
         * contain item_name.
         * We will connect this to Item Master
         * later.
         */
        item_name:
          adjustment.item_id,

        batch_id:
          adjustment.batch_id ?? null,

        transaction_type:
          "adjustment",

        quantity:
          adjustment.adjustment_quantity,

        reference_type:
          "STOCK_ADJUSTMENT",

        reference_id:
          adjustment.id,

        performed_by:
          userId,

        reason:
          adjustment.reason,

        created_at:
          approvedAt,
      });
    }

    return adjustments[index];
  }

  /*
   * Approved / Rejected adjustments cannot
   * be approved again.
   */
  throw new Error(
    `Adjustment cannot be approved from status "${adjustment.status}".`
  );
};

export const rejectStockAdjustment = (
  adjustmentId: string,
  userId: string,
  rejectionReason: string
) => {
  const adjustments = getStockAdjustments();

  const index = adjustments.findIndex(
    (adjustment) =>
      adjustment.id === adjustmentId
  );

  if (index === -1) {
    throw new Error(
      "Stock adjustment not found."
    );
  }

  const adjustment = adjustments[index];

  /*
   * Rejection is allowed only while
   * approval is still pending.
   */
  if (
    adjustment.status !==
      "Pending Approval" &&
    adjustment.status !==
      "First Approved"
  ) {
    throw new Error(
      "This adjustment cannot be rejected."
    );
  }

  if (!rejectionReason.trim()) {
    throw new Error(
      "Rejection reason is required."
    );
  }

  adjustments[index] = {
    ...adjustment,

    status: "Rejected",

    rejection_reason:
      rejectionReason.trim(),
  };

  saveStockAdjustments(adjustments);

  return adjustments[index];
};