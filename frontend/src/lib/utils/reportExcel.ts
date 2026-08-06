import * as XLSX from "xlsx";

import type { InventoryReportRow } from "@/features/inventory/types/report";    

export function exportInventoryReport(
  rows: InventoryReportRow[],
  reportName: string
) {
  if (rows.length === 0) {
    return;
  }

  const exportRows = rows.map((row) => ({
    Date: row.date,
    "Item ID": row.itemId,
    "Item Name": row.itemName,
    Category: row.category,
    Brand: row.brand,
    Supplier: row.supplier,
    Warehouse: row.warehouse,
    "Batch Number": row.batchNumber,
    "Expiry Date": row.expiryDate,
    Unit: row.unit,

    "Opening Stock": row.openingStock,
    "Received Qty": row.receivedQty,
    "Issued Qty": row.issuedQty,
    "Available Stock": row.availableStock,
    "Reorder Level": row.reorderLevel,

    Status: row.status,

    "Unit Price": row.unitPrice,
    "Stock Value": row.stockValue,
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(exportRows);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Inventory Report"
  );

  XLSX.writeFile(
    workbook,
    `${reportName}.xlsx`
  );
}