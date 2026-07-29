"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui";
import { PRIORITY_META } from "../constants";
import type { QueuePatient } from "../types";

export interface DoctorQueuePanelProps {
  patients: QueuePatient[];
  loading: boolean;
  onSelect: (patient: QueuePatient) => void;
}

export function DoctorQueuePanel({ patients, loading, onSelect }: DoctorQueuePanelProps) {
  const waiting = patients.filter((r) => r.status === "waiting" || r.status === "called").length;
  const inService = patients.filter((r) => r.status === "in_service").length;
  const completed = patients.filter((r) => r.status === "completed").length;

  const columns: DataTableColumn<QueuePatient>[] = [
    { key: "token_display", label: "Token", sortable: true, width: 96 },
    {
      key: "full_name",
      label: "Patient",
      sortable: true,
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{row.full_name}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {row.uhid} · {row.age_years}/{row.sex[0].toUpperCase()}
          </Typography>
        </Box>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        const meta = PRIORITY_META[row.priority];
        return meta ? <Badge variant={meta.variant}>{meta.label}</Badge> : null;
      },
    },
    { key: "status", label: "Status", render: (row) => <StatusChip status={row.status} /> },
    {
      key: "wait_minutes",
      label: "Wait",
      sortable: true,
      align: "right",
      render: (row) => `${row.wait_minutes} min`,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        <MetricCard label="Waiting" value={waiting} size="sm" loading={loading} />
        <MetricCard label="In Service" value={inService} size="sm" loading={loading} />
        <MetricCard label="Completed Today" value={completed} size="sm" loading={loading} />
      </Box>

      <DataTable<QueuePatient>
        columns={columns}
        rows={patients}
        loading={loading}
        getRowId={(r) => r.id}
        onRowClick={onSelect}
        emptyMessage="No patients in queue."
      />
    </Box>
  );
}
