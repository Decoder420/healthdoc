import { pharmacyPrescriptions } from "@/features/pharmacy/data/prescriptionData";

const STOCK_STORAGE_KEY = "pharmacy_stock";
const TRANSACTION_STORAGE_KEY = "pharmacy_stock_transactions";
const INVENTORY_NOTIFICATION_KEY = "pharmacy_inventory_notifications";

export interface PharmacyStockBatch {
  itemId: string;
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  availableStock: number;
  reorderLevel: number;
}

export interface PharmacyStockTransaction {
  id: string;
  itemId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  transactionType: "DISPENSE";
  prescriptionId: string;
  createdAt: string;
}

export interface InventoryNotification {
  id: string;
  itemId: string;
  medicineName: string;
  batchNumber: string;
  currentStock: number;
  reorderLevel: number;
  type: "LOW_STOCK" | "OUT_OF_STOCK";
  status: "Pending" | "Acknowledged";
  createdAt: string;
}

function isBrowser() {
  return typeof window !== "undefined";
}

/*
 * ------------------------------------------------------------
 * INITIAL STOCK
 * ------------------------------------------------------------
 *
 * For now we build pharmacy stock from prescription batches.
 *
 * Later this can be replaced by stock received through GRN/
 * pharmacy inventory APIs.
 */
function buildInitialStock(): PharmacyStockBatch[] {
  const stock: PharmacyStockBatch[] = [];

  pharmacyPrescriptions.forEach((prescription) => {
    prescription.medicines.forEach((medicine) => {
      const medicineId =
        (medicine as { medicineId?: string }).medicineId ??
        medicine.medicineName;

      medicine.batches.forEach((batch) => {
        const exists = stock.some(
          (item) =>
            item.itemId === medicineId &&
            item.batchNumber === batch.batchNumber
        );

        if (!exists) {
          stock.push({
            itemId: medicineId,
            medicineName: medicine.medicineName,
            batchNumber: batch.batchNumber,
            expiryDate: batch.expiryDate,
            availableStock: batch.availableStock,
            reorderLevel: 10,
          });
        }
      });
    });
  });

  return stock;
}

/*
 * ------------------------------------------------------------
 * GET STOCK
 * ------------------------------------------------------------
 */
export function getPharmacyStock(): PharmacyStockBatch[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STOCK_STORAGE_KEY);

    if (!stored) {
      const initialStock = buildInitialStock();

      localStorage.setItem(
        STOCK_STORAGE_KEY,
        JSON.stringify(initialStock)
      );

      return initialStock;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error(
      "Failed to load pharmacy stock:",
      error
    );

    return [];
  }
}

/*
 * ------------------------------------------------------------
 * SAVE STOCK
 * ------------------------------------------------------------
 */
function savePharmacyStock(
  stock: PharmacyStockBatch[]
) {
  if (!isBrowser()) return;

  localStorage.setItem(
    STOCK_STORAGE_KEY,
    JSON.stringify(stock)
  );
}

/*
 * ------------------------------------------------------------
 * GET STOCK BATCH
 * ------------------------------------------------------------
 */
export function getPharmacyStockBatch(
  itemId: string,
  batchNumber: string
) {
  return getPharmacyStock().find(
    (item) =>
      item.itemId === itemId &&
      item.batchNumber === batchNumber
  );
}

/*
 * ------------------------------------------------------------
 * RECORD TRANSACTION
 * ------------------------------------------------------------
 */
function recordTransaction(
  transaction: PharmacyStockTransaction
) {
  if (!isBrowser()) return;

  const existing: PharmacyStockTransaction[] =
    JSON.parse(
      localStorage.getItem(
        TRANSACTION_STORAGE_KEY
      ) || "[]"
    );

  existing.unshift(transaction);

  localStorage.setItem(
    TRANSACTION_STORAGE_KEY,
    JSON.stringify(existing)
  );
}

/*
 * ------------------------------------------------------------
 * CREATE INVENTORY NOTIFICATION
 * ------------------------------------------------------------
 */
function createInventoryNotification(
  stock: PharmacyStockBatch
) {
  if (!isBrowser()) return;

  const type =
    stock.availableStock <= 0
      ? "OUT_OF_STOCK"
      : "LOW_STOCK";

  const existing: InventoryNotification[] =
    JSON.parse(
      localStorage.getItem(
        INVENTORY_NOTIFICATION_KEY
      ) || "[]"
    );

  /*
   * Prevent duplicate pending notifications
   * for the same medicine + batch.
   */
  const alreadyExists = existing.some(
    (notification) =>
      notification.itemId === stock.itemId &&
      notification.batchNumber ===
        stock.batchNumber &&
      notification.status === "Pending" &&
      notification.type === type
  );

  if (alreadyExists) {
    return;
  }

  existing.unshift({
    id: `NOTIF-${Date.now()}`,
    itemId: stock.itemId,
    medicineName: stock.medicineName,
    batchNumber: stock.batchNumber,
    currentStock: stock.availableStock,
    reorderLevel: stock.reorderLevel,
    type,
    status: "Pending",
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(
    INVENTORY_NOTIFICATION_KEY,
    JSON.stringify(existing)
  );

  /*
   * Notify currently mounted pharmacy/inventory screens.
   */
  window.dispatchEvent(
    new Event("pharmacy-stock-updated")
  );

  window.dispatchEvent(
    new Event("inventory-stock-notification")
  );
}

/*
 * ------------------------------------------------------------
 * REDUCE STOCK
 * ------------------------------------------------------------
 */
export function reducePharmacyStock({
  itemId,
  medicineName,
  batchNumber,
  quantity,
  prescriptionId,
}: {
  itemId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  prescriptionId: string;
}) {
  if (!isBrowser()) {
    throw new Error(
      "Pharmacy stock can only be updated in the browser."
    );
  }

  if (quantity <= 0) {
    throw new Error(
      "Dispense quantity must be greater than zero."
    );
  }

  const stock = getPharmacyStock();

  const batchIndex = stock.findIndex(
    (item) =>
      item.itemId === itemId &&
      item.batchNumber === batchNumber
  );

  if (batchIndex === -1) {
    throw new Error(
      `${medicineName} batch ${batchNumber} was not found in pharmacy stock.`
    );
  }

  const batch = stock[batchIndex];

  if (quantity > batch.availableStock) {
    throw new Error(
      `${medicineName}: insufficient stock. Available stock is ${batch.availableStock}.`
    );
  }

  const updatedBatch = {
    ...batch,
    availableStock:
      batch.availableStock - quantity,
  };

  stock[batchIndex] = updatedBatch;

  savePharmacyStock(stock);

  /*
   * Record stock movement.
   */
  recordTransaction({
    id: `PH-TXN-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    itemId,
    medicineName,
    batchNumber,
    quantity,
    transactionType: "DISPENSE",
    prescriptionId,
    createdAt: new Date().toISOString(),
  });

  /*
   * Check low stock after dispensing.
   */
  if (
    updatedBatch.availableStock <=
    updatedBatch.reorderLevel
  ) {
    createInventoryNotification(
      updatedBatch
    );
  }

  return updatedBatch;
}

/*
 * ------------------------------------------------------------
 * GET TRANSACTIONS
 * ------------------------------------------------------------
 */
export function getPharmacyStockTransactions():
  PharmacyStockTransaction[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem(
        TRANSACTION_STORAGE_KEY
      ) || "[]"
    );
  } catch {
    return [];
  }
}

/*
 * ------------------------------------------------------------
 * GET INVENTORY NOTIFICATIONS
 * ------------------------------------------------------------
 */
export function getInventoryNotifications():
  InventoryNotification[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem(
        INVENTORY_NOTIFICATION_KEY
      ) || "[]"
    );
  } catch {
    return [];
  }
}