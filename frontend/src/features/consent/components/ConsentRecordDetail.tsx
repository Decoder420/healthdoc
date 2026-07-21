"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StatusChip } from "@/components/ui/StatusChip";
import { meridian } from "@/styles/theme";
import { ACCESS_CHANNEL_LABELS, CONSENT_STATUS_LABELS } from "../constants";
import { formatDate, formatDateTime } from "../lib/formatters";
import type { ConsentRecord, DataAccessLog } from "../types";
import { DataAccessLogPanel } from "./DataAccessLogPanel";

type Props = {
  record: ConsentRecord | null;
  loading?: boolean;
  accessRows: DataAccessLog[];
  accessLoading: boolean;
};

export function ConsentRecordDetail({
  record,
  loading,
  accessRows,
  accessLoading,
}: Props) {
  if (loading) {
    return (
      <Typography sx={{ color: meridian.textSecondary, p: 2 }}>Loading consent…</Typography>
    );
  }

  if (!record) {
    return (
      <Box
        sx={{
          borderRadius: "16px",
          border: `1px dashed ${meridian.border}`,
          p: 4,
          textAlign: "center",
          color: meridian.textSecondary,
        }}
      >
        Select a consent record to view linked data access events.
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          borderRadius: "16px",
          border: `1px solid ${meridian.border}`,
          background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
          boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
          p: 2.5,
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2, mb: 2 }}>
          <Box>
            <Typography sx={{ m: 0, fontSize: "1.0625rem", fontWeight: 700, color: meridian.textPrimary }}>
              {record.patient?.name ?? record.patient_id}
            </Typography>
            <Typography sx={{ m: 0, mt: 0.4, fontSize: "0.8125rem", color: meridian.textSecondary }}>
              {record.patient?.uhid} · {record.id}
            </Typography>
          </Box>
          <StatusChip status={record.status} label={CONSENT_STATUS_LABELS[record.status]} />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.75,
          }}
        >
          <Meta label="Purpose" value={record.purpose_label ?? record.purpose_code} />
          <Meta
            label="Validity"
            value={`${formatDate(record.valid_from)} → ${record.valid_to ? formatDate(record.valid_to) : "open"}`}
          />
          <Meta label="Granted" value={formatDateTime(record.granted_at)} />
          <Meta
            label="Revoked"
            value={record.revoked_at ? formatDateTime(record.revoked_at) : "—"}
          />
        </Box>
      </Box>

      <DataAccessLogPanel
        rows={accessRows}
        loading={accessLoading}
        channels={ACCESS_CHANNEL_LABELS}
      />
    </Stack>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, color: meridian.textSecondary, mb: 0.35 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary }}>{value}</Typography>
    </Box>
  );
}
