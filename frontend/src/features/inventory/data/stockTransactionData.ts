
import type {
  StockTransaction,
} from "../types/stockTransaction";

import type {
  StockAdjustment,
} from "../types/stockAdjustment";

type StockTransactionType =
  StockTransaction["transaction_type"];

const STORAGE_KEY =
  "hospital_stock_transactions";

/*
 * ============================================================
 * DEMO TRANSACTION DATA
 * ============================================================
 */

export const stockTransactionData: StockTransaction[] = [
  {
    id: "TXN-001",
    item_id: "ITEM-001",
    item_name: "Paracetamol 500mg",
    batch_id: "BATCH-PARA-001",
    transaction_type: "purchase",
    quantity: 500,
    reference_type: "GRN",
    reference_id: "GRN-001",
    performed_by: "USR-005",
    reason: "Stock received from supplier",
    created_at: "2026-08-07T09:30:00.000Z",
  },

  {
    id: "TXN-002",
    item_id: "ITEM-001",
    item_name: "Paracetamol 500mg",
    batch_id: "BATCH-PARA-001",
    transaction_type: "issue",
    quantity: -20,
    reference_type: "STOCK_ISSUE",
    reference_id: "ISS-001",
    performed_by: "USR-007",
    reason: "Issued to Pharmacy",
    created_at: "2026-08-07T10:15:00.000Z",
  },

  {
    id: "TXN-003",
    item_id: "ITEM-002",
    item_name: "Surgical Gloves",
    batch_id: "BATCH-GLOVE-001",
    transaction_type: "transfer",
    quantity: -50,
    reference_type: "TRANSFER",
    reference_id: "TRF-001",
    performed_by: "USR-005",
    reason: "Transferred to Ward A",
    created_at: "2026-08-07T10:45:00.000Z",
  },

  {
    id: "TXN-004",
    item_id: "ITEM-003",
    item_name: "Disposable Syringe 5ml",
    batch_id: "BATCH-SYR-001",
    transaction_type: "adjustment",
    quantity: -5,
    reference_type: "STOCK_ADJUSTMENT",
    reference_id: "ADJ-001",
    performed_by: "USR-006",
    reason: "Physical verification variance",
    created_at: "2026-08-07T11:20:00.000Z",
  },

  {
    id: "TXN-005",
    item_id: "ITEM-004",
    item_name: "IV Cannula 20G",
    batch_id: "BATCH-IV-001",
    transaction_type: "return",
    quantity: 10,
    reference_type: "STOCK_RETURN",
    reference_id: "RET-001",
    performed_by: "USR-007",
    reason: "Unused stock returned from department",
    created_at: "2026-08-07T11:50:00.000Z",
  },

  {
    id: "TXN-006",
    item_id: "ITEM-005",
    item_name: "Normal Saline 500ml",
    batch_id: "BATCH-NS-001",
    transaction_type: "consumption",
    quantity: -12,
    reference_type: "CONSUMPTION",
    reference_id: "CON-001",
    performed_by: "USR-005",
    reason: "Clinical consumption",
    created_at: "2026-08-07T12:10:00.000Z",
  },
];

/*
 * ============================================================
 * GET TRANSACTIONS
 * ============================================================
 */

export function getStockTransactions(): StockTransaction[] {
  if (typeof window === "undefined") {
    return stockTransactionData;
  }

  const stored =
    localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stockTransactionData)
    );

    return stockTransactionData;
  }

  try {
    return JSON.parse(
      stored
    ) as StockTransaction[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stockTransactionData)
    );

    return stockTransactionData;
  }
}

/*
 * ============================================================
 * SAVE TRANSACTIONS
 * ============================================================
 */

export function saveStockTransactions(
  transactions: StockTransaction[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

/*
 * ============================================================
 * GENERATE TRANSACTION ID
 * ============================================================
 */

export function generateTransactionId() {
  return `TXN-${Date.now()}`;
}

/*
 * ============================================================
 * CREATE TRANSACTION
 * ============================================================
 *
 * This is the ONLY function that writes a transaction.
 *
 * Duplicate reference IDs are prevented.
 * ============================================================
 */

export function createStockTransaction(
  transaction: StockTransaction
): StockTransaction {
  const existing =
    getStockTransactions();

  const existingTransaction =
    existing.find(
      (item) =>
        item.reference_id ===
          transaction.reference_id &&
        item.reference_type ===
          transaction.reference_type
    );

  if (existingTransaction) {
    return existingTransaction;
  }

  const updated = [
    ...existing,
    transaction,
  ];

  saveStockTransactions(updated);

  /*
   * Notify transaction history / ledger screens.
   */
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("stock-transaction-updated")
    );
  }

  return transaction;
}

/*
 * ============================================================
 * CREATE TRANSACTION FROM FINAL APPROVED ADJUSTMENT
 * ============================================================
 *
 * IMPORTANT:
 *
 * This function must ONLY be called after:
 *
 * Pending Approval
 *       ↓
 * First Approved
 *       ↓
 * Approved
 *
 * It must NEVER be called during first approval.
 * ============================================================
 */

export function createAdjustmentTransaction(
  adjustment: StockAdjustment
): StockTransaction {
  if (
    adjustment.status !== "Approved"
  ) {
    throw new Error(
      "Stock transaction can only be created after final approval."
    );
  }

  const transaction: StockTransaction = {
    id: generateTransactionId(),

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

    /*
     * FINAL approver is the person
     * who actually performed the adjustment.
     */
    performed_by:
      adjustment.second_approved_by!,

    reason:
      adjustment.reason,

    created_at:
      adjustment.second_approved_at ??
      new Date().toISOString(),
  };

  return createStockTransaction(
    transaction
  );
}

/*
 * ============================================================
 * GET TRANSACTIONS BY TYPE
 * ============================================================
 */

export function getTransactionsByType(
  transactionType: StockTransactionType
) {
  return getStockTransactions().filter(
    (transaction) =>
      transaction.transaction_type ===
      transactionType
  );
}

