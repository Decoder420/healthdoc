"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { useConsentDetail } from "../hooks/useConsentDetail";
import { useConsentRecords } from "../hooks/useConsentRecords";
import { useDataAccessLogs } from "../hooks/useDataAccessLogs";
import { ConsentListPanel } from "./ConsentListPanel";
import { ConsentRecordDetail } from "./ConsentRecordDetail";

export function ConsentDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = useConsentRecords({ status: "all" });
  const detail = useConsentDetail(selectedId);
  const access = useDataAccessLogs(selectedId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: meridian.textPrimary,
          }}
        >
          Consent records
        </Typography>
        <Typography sx={{ m: 0, mt: 0.5, fontSize: "0.875rem", color: meridian.textSecondary }}>
          Consent artifacts + linked data_access_log (migration 0004)
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderRadius: "12px",
          backgroundColor: "#e8eef5",
          color: meridian.brandPrimary,
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        Read ledger is append-only. Break-glass rows show emergency_access without verified consent.
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "320px 1fr" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        <ConsentListPanel
          rows={list.rows}
          loading={list.loading}
          query={list.filters.query ?? ""}
          status={list.filters.status ?? "all"}
          selectedId={selectedId}
          onQueryChange={list.setQuery}
          onStatusChange={list.setStatus}
          onSelect={setSelectedId}
        />
        <ConsentRecordDetail
          record={detail.record}
          loading={detail.loading}
          accessRows={access.rows}
          accessLoading={access.loading}
        />
      </Box>
    </Box>
  );
}
