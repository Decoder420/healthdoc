
import type { StockAdjustment } from "../types/stockAdjustment";

import {
  createStockTransaction,
  getStockTransactions,
} from "./stockTransactionData";

import type { StockTransaction } from "../types/stockTransaction";

import {
  appendStockLedgerEntry,
  generateStockLedgerId,
} from "./stockLedgerData";

import type { StockLedgerEntry } from "../types/stockLedger";

const STORAGE_KEY = "hospital_stock_adjustments";

const STOCK_ADJUSTMENT_UPDATED_EVENT =
  "stock-adjustment-updated";

/*
 * ============================================================
 * GET STOCK ADJUSTMENTS
 * ============================================================
 */

export function getStockAdjustments(): StockAdjustment[] {
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
}

/*
 * ============================================================
 * SAVE STOCK ADJUSTMENTS
 * ============================================================
 */

export function saveStockAdjustments(
  adjustments: StockAdjustment[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(adjustments)
  );

  /*
   * Notify all open UI components that
   * stock adjustment data changed.
   */
  window.dispatchEvent(
    new CustomEvent(
      STOCK_ADJUSTMENT_UPDATED_EVENT
    )
  );
}

/*
 * ============================================================
 * GENERATE ADJUSTMENT ID
 * ============================================================
 */

export function generateAdjustmentId(): string {
  return `ADJ-${Date.now()}`;
}

/*
 * ============================================================
 * CREATE STOCK ADJUSTMENT
 *
 * Physical Verification
 *        ↓
 * Stock Adjustment
 *        ↓
 * Pending Approval
 * ============================================================
 */

export function createStockAdjustment(
  adjustment: StockAdjustment
): StockAdjustment {
  if (typeof window === "undefined") {
    throw new Error(
      "Stock adjustment can only be created in the browser."
    );
  }

  if (
    adjustment.status !== "Pending Approval"
  ) {
    throw new Error(
      "New stock adjustments must start with Pending Approval status."
    );
  }

  const existing = getStockAdjustments();

  /*
   * Prevent accidental duplicate adjustment IDs.
   */
  const duplicate = existing.some(
    (item) => item.id === adjustment.id
  );

  if (duplicate) {
    throw new Error(
      `Stock adjustment "${adjustment.id}" already exists.`
    );
  }

  const updated = [
    ...existing,
    adjustment,
  ];

  saveStockAdjustments(updated);

  console.log(
    "STOCK ADJUSTMENT CREATED:",
    adjustment
  );

  console.log(
    "ALL STOCK ADJUSTMENTS:",
    getStockAdjustments()
  );

  return adjustment;
}

/*
 * ============================================================
 * APPROVE STOCK ADJUSTMENT
 *
 * Pending Approval
 *        ↓
 * First Approved
 *        ↓
 * Approved
 *
 * ONLY FINAL APPROVAL creates:
 *
 * Stock Transaction
 *        ↓
 * Transaction History
 *        ↓
 * Stock Ledger
 * ============================================================
 */

export function approveStockAdjustment(
  adjustmentId: string,
  userId: string
) {
  if (typeof window === "undefined") {
    throw new Error(
      "Stock adjustment approval can only be performed in the browser."
    );
  }

  if (!userId) {
    throw new Error(
      "Approving user is required."
    );
  }

  const adjustments = getStockAdjustments();

  const adjustment = adjustments.find(
    (item) => item.id === adjustmentId
  );

  if (!adjustment) {
    throw new Error(
      "Stock adjustment not found."
    );
  }

  /*
   * ========================================================
   * FIRST APPROVAL
   *
   * Pending Approval
   *        ↓
   * First Approved
   * ========================================================
   */

  if (
    adjustment.status ===
    "Pending Approval"
  ) {
    const firstApprovedAt =
      new Date().toISOString();

    const updated = adjustments.map(
      (item) =>
        item.id === adjustmentId
          ? {
              ...item,

              status:
                "First Approved" as const,

              first_approved_by:
                userId,

              first_approved_at:
                firstApprovedAt,

              /*
               * Make sure second approval
               * fields remain empty.
               */
              second_approved_by:
                null,

              second_approved_at:
                null,

              rejection_reason:
                null,
            }
          : item
    );

    saveStockAdjustments(updated);

    console.log(
      "FIRST SIGN-OFF COMPLETED:",
      adjustmentId
    );

    return;
  }

  /*
   * ========================================================
   * FINAL APPROVAL
   *
   * First Approved
   *        ↓
   * Approved
   * ========================================================
   */

  if (
    adjustment.status ===
    "First Approved"
  ) {
    /*
     * Second sign-off MUST be another user.
     */
    if (
      adjustment.first_approved_by &&
      adjustment.first_approved_by === userId
    ) {
      throw new Error(
        "Final approval must be performed by a different authorized user."
      );
    }

    const approvedAt =
      new Date().toISOString();

    /*
     * --------------------------------------------------------
     * UPDATE ADJUSTMENT
     * --------------------------------------------------------
     */

    const updated = adjustments.map(
      (item) =>
        item.id === adjustmentId
          ? {
              ...item,

              status:
                "Approved" as const,

              second_approved_by:
                userId,

              second_approved_at:
                approvedAt,

              rejection_reason:
                null,
            }
          : item
    );

    saveStockAdjustments(updated);

    /*
     * --------------------------------------------------------
     * FINAL APPROVAL → STOCK TRANSACTION
     * --------------------------------------------------------
     */

    const existingTransactions =
      getStockTransactions();

    const transactionAlreadyExists =
      existingTransactions.some(
        (transaction) =>
          transaction.reference_type ===
            "STOCK_ADJUSTMENT" &&
          transaction.reference_id ===
            adjustment.id
      );

    if (!transactionAlreadyExists) {
      const transaction: StockTransaction = {
        id: `TXN-${Date.now()}`,

        item_id:
          adjustment.item_id,

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
      };

      createStockTransaction(
        transaction
      );
    }

    /*
     * --------------------------------------------------------
     * FINAL APPROVAL → STOCK LEDGER
     * --------------------------------------------------------
     */

    const existingLedger =
      getStockLedgerSafely();

    const ledgerAlreadyExists =
      existingLedger.some(
        (entry) =>
          entry.reference_type ===
            "stock_adjustment" &&
          entry.reference_id ===
            adjustment.id
      );

    if (!ledgerAlreadyExists) {
      const ledgerEntry: StockLedgerEntry = {
        id: generateStockLedgerId(),

        item_id:
          adjustment.item_id,

        batch_id:
          adjustment.batch_id ?? null,

        transaction_type:
          "adjustment",

        quantity:
          adjustment.adjustment_quantity,

        reference_type:
          "stock_adjustment",

        reference_id:
          adjustment.id,

        performed_by:
          userId,

        reason:
          adjustment.reason,

        created_at:
          approvedAt,
      };

      appendStockLedgerEntry(
        ledgerEntry
      );
    }

    console.log(
      "FINAL APPROVAL COMPLETED:",
      adjustmentId
    );

    console.log(
      "STOCK TRANSACTION + LEDGER UPDATED"
    );

    return;
  }

  /*
   * ========================================================
   * INVALID STATUS
   * ========================================================
   */

  throw new Error(
    `Adjustment cannot be approved from status "${adjustment.status}".`
  );
}

/*
 * ============================================================
 * SAFE LEDGER READER
 * ============================================================
 */

function getStockLedgerSafely(): StockLedgerEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(
        "hospital_stock_ledger"
      );

    if (!stored) {
      return [];
    }

    return JSON.parse(
      stored
    ) as StockLedgerEntry[];
  } catch {
    return [];
  }
}

/*
 * ============================================================
 * REJECT STOCK ADJUSTMENT
 * ============================================================
 *
 * Pending Approval → Rejected
 *
 * First Approved → Rejected
 *
 * Rejection does NOT create:
 * - transaction
 * - ledger entry
 * ============================================================
 */

export function rejectStockAdjustment(
  adjustmentId: string,
  userId: string,
  rejectionReason: string
) {
  if (typeof window === "undefined") {
    throw new Error(
      "Stock adjustment rejection can only be performed in the browser."
    );
  }

  if (!userId) {
    throw new Error(
      "Rejecting user is required."
    );
  }

  if (!rejectionReason.trim()) {
    throw new Error(
      "Rejection reason is required."
    );
  }

  const adjustments = getStockAdjustments();

  const adjustment = adjustments.find(
    (item) => item.id === adjustmentId
  );

  if (!adjustment) {
    throw new Error(
      "Stock adjustment not found."
    );
  }

  if (
    adjustment.status !==
      "Pending Approval" &&
    adjustment.status !==
      "First Approved"
  ) {
    throw new Error(
      `Adjustment cannot be rejected from status "${adjustment.status}".`
    );
  }

  const updated =
    adjustments.map((item) =>
      item.id === adjustmentId
        ? {
            ...item,

            status:
              "Rejected" as const,

            rejection_reason:
              `${rejectionReason.trim()} (Rejected by ${userId})`,
          }
        : item
    );

  saveStockAdjustments(updated);

  console.log(
    "STOCK ADJUSTMENT REJECTED:",
    adjustmentId
  );
}
