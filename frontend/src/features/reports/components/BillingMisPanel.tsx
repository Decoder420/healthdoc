"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { MetricCard } from "@/components/ui/MetricCard";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { meridian } from "@/styles/theme";
import {
  getDailyRevenue,
  getPendingInvoices,
  getSchemeBreakdown,
} from "@/features/billing/api/mis";
import { formatINR } from "@/features/billing/lib/formatters";
import { fromMoney } from "@/features/billing/lib/money";
import type {
  DailyRevenueResponse,
  PendingInvoicesResponse,
  SchemeBreakdownLine,
  SchemeBreakdownResponse,
} from "@/features/billing/types";

/**
 * Live BE surface: GET /billing/mis/*
 * (Separate from kpi_snapshots / GET /reports/kpis — schema-documented but not implemented on BE yet.)
 */
export function BillingMisPanel() {
  const [revenue, setRevenue] = useState<DailyRevenueResponse | null>(null);
  const [pending, setPending] = useState<PendingInvoicesResponse | null>(null);
  const [schemes, setSchemes] = useState<SchemeBreakdownResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void Promise.all([
      getDailyRevenue({ date_from: "2026-07-14", date_to: "2026-07-20" }),
      getPendingInvoices(),
      getSchemeBreakdown({ date_from: "2026-07-14", date_to: "2026-07-20" }),
    ])
      .then(([rev, pen, sch]) => {
        if (cancelled) return;
        setRevenue(rev);
        setPending(pen);
        setSchemes(sch);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "MIS load failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const schemeColumns: DataTableColumn<SchemeBreakdownLine>[] = [
    { key: "scheme_code", label: "Scheme", render: (r) => r.scheme_code },
    { key: "invoice_count", label: "Invoices", render: (r) => String(r.invoice_count) },
    {
      key: "net_billed",
      label: "Net billed",
      align: "right",
      render: (r) => formatINR(fromMoney(r.net_billed)),
    },
    {
      key: "collected_total",
      label: "Collected",
      align: "right",
      render: (r) => formatINR(fromMoney(r.collected_total)),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography
          sx={{
            m: 0,
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: meridian.textSecondary,
          }}
        >
          Billing MIS · /billing/mis/*
        </Typography>
        <Typography sx={{ m: 0, mt: 0.5, fontSize: "1.125rem", fontWeight: 700 }}>
          Revenue &amp; receivables
        </Typography>
        <Typography sx={{ m: 0, mt: 0.5, fontSize: "0.8125rem", color: meridian.textSecondary }}>
          Live BE contract (date_from / date_to business dates). Not kpi_snapshots.
        </Typography>
      </Box>

      {error ? (
        <Typography sx={{ color: meridian.danger, fontSize: "0.875rem" }}>{error}</Typography>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        }}
      >
        <MetricCard
          label="Net revenue (window)"
          value={
            revenue ? formatINR(fromMoney(revenue.total_net_revenue)) : "—"
          }
          loading={loading}
        />
        <MetricCard
          label="Pending invoices"
          value={pending ? String(pending.count) : "—"}
          loading={loading}
        />
        <MetricCard
          label="Balance due"
          value={
            pending ? formatINR(fromMoney(pending.total_balance_due)) : "—"
          }
          loading={loading}
        />
      </Box>

      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
          Scheme breakdown
        </Typography>
        <DataTable
          columns={schemeColumns}
          rows={schemes?.lines ?? []}
          getRowId={(r) => r.scheme_code}
          emptyMessage={loading ? "Loading…" : "No scheme rows in window."}
        />
      </Stack>
    </Box>
  );
}
