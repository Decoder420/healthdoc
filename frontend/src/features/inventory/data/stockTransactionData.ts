import type {
  StockTransaction,
  StockTransactionType,
} from "../types/stockTransaction";

const STORAGE_KEY = "hospital_stock_transactions";

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

export const getStockTransactions = (): StockTransaction[] => {
  if (typeof window === "undefined") {
    return stockTransactionData;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stockTransactionData)
    );

    return stockTransactionData;
  }

  try {
    return JSON.parse(stored) as StockTransaction[];
  } catch {
    return stockTransactionData;
  }
};

export const saveStockTransactions = (
  transactions: StockTransaction[]
) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
};

export const generateTransactionId = () => {
  return `TXN-${Date.now()}`;
};

export const createStockTransaction = (
  transaction: StockTransaction
): StockTransaction => {
  const existing = getStockTransactions();

  saveStockTransactions([
    ...existing,
    transaction,
  ]);

  return transaction;
};

export const getTransactionsByType = (
  transactionType: StockTransactionType
) => {
  return getStockTransactions().filter(
    (transaction) =>
      transaction.transaction_type ===
      transactionType
  );
};