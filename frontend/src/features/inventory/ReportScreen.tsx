"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

import ReportStats from "@/components/dashboard/inventory/reports/ReportStats";
import ExportReportButton from "@/components/dashboard/inventory/reports/ExportReportButton";
import ReportTabs, {
  type ReportTab,
} from "@/components/dashboard/inventory/reports/ReportTabs";
import ReportTable from "@/components/dashboard/inventory/reports/ReportTable";
import StockMovementReport from "@/components/dashboard/inventory/reports/StockMovementReport";

import type {
  InventoryReportRow,
} from "@/features/inventory/types/report";

/* =========================================================
   EXCEL READER
========================================================= */

const readInventoryExcel = async (
  file: File
): Promise<InventoryReportRow[]> => {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheetName =
    workbook.SheetNames[0];

  if (!sheetName) {
    return [];
  }

  const sheet =
    workbook.Sheets[sheetName];

  if (!sheet) {
    return [];
  }

  const rows =
    XLSX.utils.sheet_to_json<
      Record<string, unknown>
    >(sheet, {
      defval: "",
    });

  /* -------------------------------------------------------
     Find a value using multiple possible column names
  ------------------------------------------------------- */

  const getValue = (
    row: Record<string, unknown>,
    keys: string[]
  ) => {
    for (const key of keys) {
      const value = row[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }
    }

    return "";
  };

  /* -------------------------------------------------------
     Convert value to number
  ------------------------------------------------------- */

  const toNumber = (
    value: unknown
  ): number => {
    if (typeof value === "number") {
      return Number.isFinite(value)
        ? value
        : 0;
    }

    if (typeof value === "string") {
      const normalized = value
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .trim();

      const parsed =
        Number(normalized);

      return Number.isFinite(parsed)
        ? parsed
        : 0;
    }

    return 0;
  };

  /* -------------------------------------------------------
     Convert Excel rows
  ------------------------------------------------------- */

  return rows.map((row) => {
    const statusValue = String(
      getValue(row, [
        "status",
        "Status",
      ]) || "Available"
    );

    const validStatuses: InventoryReportRow["status"][] =
      [
        "Available",
        "Low Stock",
        "Out of Stock",
        "Near Expiry",
      ];

    const status =
      validStatuses.includes(
        statusValue as InventoryReportRow["status"]
      )
        ? (statusValue as InventoryReportRow["status"])
        : "Available";

    return {
      date: String(
        getValue(row, [
          "date",
          "Date",
        ]) || ""
      ),

      itemId: String(
        getValue(row, [
          "itemId",
          "Item ID",
          "item_id",
          "id",
        ]) || ""
      ),

      itemName: String(
        getValue(row, [
          "itemName",
          "Item Name",
          "item_name",
          "name",
          "Item",
        ]) || ""
      ),

      category: String(
        getValue(row, [
          "category",
          "Category",
          "itemCategory",
          "Item Category",
        ]) || ""
      ),

      brand: String(
        getValue(row, [
          "brand",
          "Brand",
        ]) || ""
      ),

      supplier: String(
        getValue(row, [
          "supplier",
          "Supplier",
          "supplierName",
          "Supplier Name",
        ]) || ""
      ),

      warehouse: String(
        getValue(row, [
          "warehouse",
          "Warehouse",
          "location",
          "Location",
        ]) || ""
      ),

      batchNumber: String(
        getValue(row, [
          "batchNumber",
          "Batch Number",
          "batch_no",
          "batch",
        ]) || ""
      ),

      expiryDate: String(
        getValue(row, [
          "expiryDate",
          "Expiry Date",
          "expiry",
          "Expiry",
        ]) || ""
      ),

      unit: String(
        getValue(row, [
          "unit",
          "Unit",
          "uom",
          "UOM",
        ]) || ""
      ),

      openingStock: toNumber(
        getValue(row, [
          "openingStock",
          "Opening Stock",
          "opening",
          "opening_qty",
        ])
      ),

      receivedQty: toNumber(
        getValue(row, [
          "receivedQty",
          "Received Qty",
          "received",
          "received_quantity",
        ])
      ),

      issuedQty: toNumber(
        getValue(row, [
          "issuedQty",
          "Issued Qty",
          "issued",
          "issued_quantity",
        ])
      ),

      availableStock: toNumber(
        getValue(row, [
          "availableStock",
          "Available Stock",
          "available",
          "qty_available",
          "stock_available",
        ])
      ),

      reorderLevel: toNumber(
        getValue(row, [
          "reorderLevel",
          "Reorder Level",
          "reorder",
          "minimumStock",
          "min_stock",
        ])
      ),

      status,

      unitPrice: toNumber(
        getValue(row, [
          "unitPrice",
          "Unit Price",
          "price",
          "unit_price",
        ])
      ),

      stockValue: toNumber(
        getValue(row, [
          "stockValue",
          "Stock Value",
          "value",
          "stock_value",
          "amount",
        ])
      ),
    };
  });
};

/* =========================================================
   REPORT FILE NAME
========================================================= */

function getReportName(
  tab: ReportTab
): string {
  switch (tab) {
    case "low-stock":
      return "Inventory-Low-Stock";

    case "near-expiry":
      return "Inventory-Near-Expiry";

    case "movement":
      return "Inventory-Stock-Movement";

    case "overview":
    default:
      return "Inventory-Overview";
  }
}

/* =========================================================
   REPORT SCREEN
========================================================= */

export default function ReportsScreen() {
  const [rows, setRows] =
    useState<InventoryReportRow[]>([]);

  const [fileName, setFileName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<ReportTab>("overview");

  /* =======================================================
     FILE UPLOAD
  ======================================================= */

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setLoading(true);

      const data =
        await readInventoryExcel(file);

      setRows(data);
      setFileName(file.name);

      setActiveTab("overview");
    } catch (error) {
      console.error(
        "Excel report error:",
        error
      );

      alert(
        "Unable to read the Excel file."
      );
    } finally {
      setLoading(false);

      // Allows selecting the same
      // file again.
      event.target.value = "";
    }
  };

  /* =======================================================
     FILTERED REPORT DATA
  ======================================================= */

  const lowStockRows =
    rows.filter(
      (row) =>
        row.status === "Low Stock" ||
        row.status === "Out of Stock"
    );

  const nearExpiryRows =
    rows.filter(
      (row) =>
        row.status === "Near Expiry"
    );

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Inventory Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Reports
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload inventory data and generate
            inventory reports.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Export */}

          <ExportReportButton
            rows={rows}
            reportName={getReportName(
              activeTab
            )}
            disabled={loading}
          />

          {/* Upload */}

          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">

            {loading
              ? "Reading..."
              : "Upload Excel"}

            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={
                handleFileUpload
              }
            />

          </label>

        </div>
      </div>

      {/* =================================================
          FILE INFO
      ================================================= */}

      {fileName && (
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">

          <p className="text-sm">
            Loaded file:{" "}
            <span className="font-semibold">
              {fileName}
            </span>
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {rows.length} inventory records
            loaded.
          </p>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <ReportStats rows={rows} />

      {/* =================================================
          TABS
      ================================================= */}

      {rows.length > 0 && (
        <ReportTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      {rows.length === 0 ? (

        <div className="surface-card flex min-h-[300px] items-center justify-center p-8 text-center">

          <div>

            <h2 className="text-lg font-semibold">
              No Report Data
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload the hospital inventory
              Excel file to generate reports.
            </p>

          </div>

        </div>

      ) : (

        <>

          {/* OVERVIEW */}

          {activeTab === "overview" && (
            <ReportTable
              rows={rows}
              emptyMessage="No inventory records found."
            />
          )}

          {/* LOW STOCK */}

          {activeTab === "low-stock" && (
            <ReportTable
              rows={lowStockRows}
              emptyMessage="There are currently no low-stock items."
            />
          )}

          {/* NEAR EXPIRY */}

          {activeTab === "near-expiry" && (
            <ReportTable
              rows={nearExpiryRows}
              emptyMessage="There are currently no near-expiry items."
            />
          )}

          {/* STOCK MOVEMENT */}

          {activeTab === "movement" && (
            <StockMovementReport
              rows={rows}
            />
          )}

        </>

      )}

    </div>
  );
}