import {
  getPharmacyStock,
} from "./pharmacyStockData";

export type PharmacyStockAlertType =
  | "Low Stock"
  | "Critical Stock"
  | "Out of Stock";

export interface PharmacyStockAlert {
  id: string;

  itemId: string;

  itemName: string;

  availableStock: number;

  reorderLevel: number;

  minimumStock: number;

  unit: string;

  type: PharmacyStockAlertType;

  message: string;

  requiresIndent: boolean;

  createdAt: string;
}

export function getPharmacyStockAlerts(): PharmacyStockAlert[] {
  const stock = getPharmacyStock();

  return stock
    .filter(
      (item) =>
        item.availableStock <= item.reorderLevel
    )
    .map((item) => {
      let type: PharmacyStockAlertType;

      if (item.availableStock === 0) {
        type = "Out of Stock";
      } else if (
        item.availableStock <= item.minimumStock
      ) {
        type = "Critical Stock";
      } else {
        type = "Low Stock";
      }

      return {
        id: `ALERT-${item.id}`,

        itemId: item.itemId,

        itemName: item.itemName,

        availableStock: item.availableStock,

        reorderLevel: item.reorderLevel,

        minimumStock: item.minimumStock,

        unit: item.unit,

        type,

        message:
          type === "Out of Stock"
            ? `${item.itemName} is out of stock.`
            : type === "Critical Stock"
              ? `${item.itemName} stock is critically low.`
              : `${item.itemName} stock is below reorder level.`,

        requiresIndent: true,

        createdAt: new Date().toISOString(),
      };
    });
}