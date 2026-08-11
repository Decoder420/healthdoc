
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import StockLedgerStats from "@/components/dashboard/inventory/Audit/StockLedger/StockLedgerStats";

import StockLedgerFilters, {
  type StockLedgerFilterValues,
} from "@/components/dashboard/inventory/Audit/StockLedger/StockLedgerFilters";

import StockLedgerTable from "@/components/dashboard/inventory/Audit/StockLedger/StockLedgerTable";

import {
  getStockLedger,
} from "@/features/inventory/data/stockLedgerData";

import type {
  StockLedgerEntry,
} from "@/features/inventory/types/stockLedger";

import {
  getExpiryTracker,
} from "@/features/inventory/data/expiryTrackerData";

import type {
  ExpiryStockItem,
} from "@/features/inventory/types/expiryTracker";

import ExpiryTracker from "@/components/dashboard/inventory/Audit/StockLedger/ExpiryTracker";

const initialFilters: StockLedgerFilterValues = {
  search: "",
  transactionType: "",
  referenceType: "",
  date: "",
};

export default function StockLedgerScreen() {
  const [entries, setEntries] =
    useState<StockLedgerEntry[]>([]);

  const [filters, setFilters] =
    useState<StockLedgerFilterValues>(
      initialFilters
    );

  const [expiryItems, setExpiryItems] =
    useState<ExpiryStockItem[]>([]);

  /*
   * ============================================================
   * LOAD LEDGER
   * ============================================================
   *
   * Stock Ledger is read-only.
   *
   * Data flow:
   *
   * Stock Transaction
   *        ↓
   * Stock Ledger
   *
   * There is no direct stock adjustment creation here.
   */
  useEffect(() => {
    setEntries(getStockLedger());
    setExpiryItems(getExpiryTracker());
  }, []);

  /*
   * ============================================================
   * FILTER LEDGER
   * ============================================================
   */

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const search =
        filters.search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        entry.item_id
          .toLowerCase()
          .includes(search) ||
        entry.batch_id
          ?.toLowerCase()
          .includes(search) ||
        entry.reference_id
          ?.toLowerCase()
          .includes(search);

      const matchesTransaction =
        !filters.transactionType ||
        entry.transaction_type ===
          filters.transactionType;

      const matchesReference =
        !filters.referenceType ||
        entry.reference_type
          ?.toLowerCase()
          .includes(
            filters.referenceType
              .toLowerCase()
          );

      const matchesDate =
        !filters.date ||
        entry.created_at.startsWith(
          filters.date
        );

      return (
        matchesSearch &&
        matchesTransaction &&
        matchesReference &&
        matchesDate
      );
    });
  }, [entries, filters]);

  /*
   * ============================================================
   * STATISTICS
   * ============================================================
   */

  const stats = useMemo(() => {
    const totalIn = entries
      .filter(
        (entry) =>
          entry.quantity > 0
      )
      .reduce(
        (sum, entry) =>
          sum + entry.quantity,
        0
      );

    const totalOut = Math.abs(
      entries
        .filter(
          (entry) =>
            entry.quantity < 0
        )
        .reduce(
          (sum, entry) =>
            sum + entry.quantity,
          0
        )
    );

    const adjustments =
      entries.filter(
        (entry) =>
          entry.transaction_type ===
          "adjustment"
      ).length;

    return {
      totalTransactions:
        entries.length,

      totalIn,

      totalOut,

      adjustments,
    };
  }, [entries]);

  /*
   * ============================================================
   * RESET FILTERS
   * ============================================================
   */

  const handleReset = () => {
    setFilters(initialFilters);
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <Box sx={{ p: 3 }}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Stock Ledger
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={0.5}
        >
          Append-only record of all
          inventory stock movements.
        </Typography>
      </Box>

      {/* ======================================================
          FLOW INFORMATION
      ====================================================== */}

      <Box
        sx={{
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor:
            "background.paper",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
        >
          Inventory Audit Flow
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Warehouse → Stock List →
          Physical Verification →
          Stock Adjustment →
          Dual Sign-off →
          Stock Transaction →
          Transaction History →
          Stock Ledger
        </Typography>
      </Box>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <StockLedgerStats
        {...stats}
      />

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <StockLedgerFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />

      {/* ======================================================
          LEDGER TABLE
      ====================================================== */}

      <StockLedgerTable
        entries={filteredEntries}
      />

      {/* ======================================================
          EXPIRY TRACKER
      ====================================================== */}

      <ExpiryTracker
        items={expiryItems}
      />

    </Box>
  );
}

