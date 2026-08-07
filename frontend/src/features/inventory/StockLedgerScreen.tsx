
"use client";

import { useEffect, useMemo, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";

import StockLedgerStats from "@/components/dashboard/inventory/Audit/StockLedger/StockLedgerStats";
import StockLedgerFilters, {
  type StockLedgerFilterValues,
} from "@/components/dashboard/inventory/Audit/StockLedger/StockLedgerFilters";
import StockLedgerTable from "@/components/dashboard/inventory/Audit/StockLedger/StockLedgerTable";
import StockAdjustmentDialog from "@/components/dashboard/inventory/Audit/StockLedger/StockAdjustmentDialog";

import { getStockLedger } from "@/features/inventory/data/stockLedgerData";
import type { StockLedgerEntry } from "@/features/inventory/types/stockLedger";

import { getExpiryTracker } from "@/features/inventory/data/expiryTrackerData";

import type { ExpiryStockItem } from "@/features/inventory/types/expiryTracker";

import ExpiryTracker from "@/components/dashboard/inventory/Audit/StockLedger/ExpiryTracker";

const initialFilters: StockLedgerFilterValues = {
  search: "",
  transactionType: "",
  referenceType: "",
  date: "",
};



export default function StockLedgerScreen() {
  const [entries, setEntries] = useState<StockLedgerEntry[]>([]);
  const [filters, setFilters] =
    useState<StockLedgerFilterValues>(initialFilters);

  // Stock adjustment dialog state MUST be inside the component
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const [expiryItems, setExpiryItems] =
  useState<ExpiryStockItem[]>([]);

  useEffect(() => {
    setEntries(getStockLedger());
    setExpiryItems(getExpiryTracker());
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const search = filters.search.toLowerCase().trim();

      const matchesSearch =
        !search ||
        entry.item_id.toLowerCase().includes(search) ||
        entry.batch_id?.toLowerCase().includes(search) ||
        entry.reference_id?.toLowerCase().includes(search);

      const matchesTransaction =
        !filters.transactionType ||
        entry.transaction_type === filters.transactionType;

      const matchesReference =
        !filters.referenceType ||
        entry.reference_type
          ?.toLowerCase()
          .includes(filters.referenceType.toLowerCase());

      const matchesDate =
        !filters.date ||
        entry.created_at.startsWith(filters.date);

      return (
        matchesSearch &&
        matchesTransaction &&
        matchesReference &&
        matchesDate
      );
    });
  }, [entries, filters]);

  const stats = useMemo(() => {
    const totalIn = entries
      .filter((entry) => entry.quantity > 0)
      .reduce((sum, entry) => sum + entry.quantity, 0);

    const totalOut = Math.abs(
      entries
        .filter((entry) => entry.quantity < 0)
        .reduce((sum, entry) => sum + entry.quantity, 0)
    );

    const adjustments = entries.filter(
      (entry) => entry.transaction_type === "adjustment"
    ).length;

    return {
      totalTransactions: entries.length,
      totalIn,
      totalOut,
      adjustments,
    };
  }, [entries]);

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Stock Ledger
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Append-only record of all inventory stock movements.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setAdjustmentOpen(true)}
        >
          Stock Adjustment
        </Button>
      </Box>

      {/* Statistics */}
      <StockLedgerStats {...stats} />

      {/* Filters */}
      <StockLedgerFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />

      {/* Ledger Table */}
      <StockLedgerTable entries={filteredEntries} />

      {/* Stock Adjustment Dialog */}
      <StockAdjustmentDialog
        open={adjustmentOpen}
        onClose={() => {
          setAdjustmentOpen(false);
        }}
        onCreated={() => {
          setEntries(getStockLedger());
        }}
      />

<ExpiryTracker items={expiryItems} />

    </Box>
  );
}

