"use client";

import { useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";

import TransactionHistoryHeader from "@/components/dashboard/inventory/Audit/TransactionHistory/TransactionHistoryHeader";

import TransactionHistoryStats from "@/components/dashboard/inventory/Audit/TransactionHistory/TransactionHistoryStats";

import TransactionHistoryFilters, {
  type TransactionHistoryFilterValues,
} from "@/components/dashboard/inventory/Audit/TransactionHistory/TransactionHistoryFilters";

import TransactionHistoryTable from "@/components/dashboard/inventory/Audit/TransactionHistory/TransactionHistoryTable";

import {
  getStockTransactions,
} from "@/features/inventory/data/stockTransactionData";

import type {
  StockTransaction,
} from "@/features/inventory/types/stockTransaction";

const initialFilters: TransactionHistoryFilterValues = {
  search: "",
  transactionType: "",
  performedBy: "",
  dateFrom: "",
  dateTo: "",
};

export default function TransactionHistoryScreen() {
  const [transactions, setTransactions] =
    useState<StockTransaction[]>([]);

  const [filters, setFilters] =
    useState<TransactionHistoryFilterValues>(
      initialFilters
    );

  useEffect(() => {
    setTransactions(getStockTransactions());
  }, []);

  const filteredTransactions = useMemo(() => {
    const search =
      filters.search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !search ||
        transaction.id
          .toLowerCase()
          .includes(search) ||
        transaction.item_id
          .toLowerCase()
          .includes(search) ||
        transaction.item_name
          .toLowerCase()
          .includes(search) ||
        transaction.reference_id
          ?.toLowerCase()
          .includes(search);

      const matchesType =
        !filters.transactionType ||
        transaction.transaction_type ===
          filters.transactionType;

      const matchesUser =
        !filters.performedBy ||
        transaction.performed_by
          .toLowerCase()
          .includes(
            filters.performedBy
              .toLowerCase()
              .trim()
          );

      const transactionDate =
        new Date(transaction.created_at);

      const matchesFrom =
        !filters.dateFrom ||
        transactionDate >=
          new Date(
            `${filters.dateFrom}T00:00:00`
          );

      const matchesTo =
        !filters.dateTo ||
        transactionDate <=
          new Date(
            `${filters.dateTo}T23:59:59`
          );

      return (
        matchesSearch &&
        matchesType &&
        matchesUser &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [transactions, filters]);

  const stats = useMemo(() => {
    return {
      total: transactions.length,

      purchases: transactions.filter(
        (transaction) =>
          transaction.transaction_type ===
          "purchase"
      ).length,

      issues: transactions.filter(
        (transaction) =>
          transaction.transaction_type ===
          "issue"
      ).length,

      adjustments: transactions.filter(
        (transaction) =>
          transaction.transaction_type ===
          "adjustment"
      ).length,

      transfers: transactions.filter(
        (transaction) =>
          transaction.transaction_type ===
          "transfer"
      ).length,
    };
  }, [transactions]);

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <TransactionHistoryHeader />

      <TransactionHistoryStats
        {...stats}
      />

      <TransactionHistoryFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />

      <TransactionHistoryTable
        transactions={filteredTransactions}
      />
    </Box>
  );
}