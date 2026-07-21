"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui";
import { mockDoctorQueue, type QueuePatient, type PriorityType } from "./mockQueue";

const PRIORITY_META: Record<PriorityType, { label: string; variant: BadgeVariant } | null> = {
  normal: null, // don't show a badge for the common case — reduces visual noise
  senior_citizen: { label: "Senior", variant: "secondary" },
  pregnant: { label: "Pregnant", variant: "secondary" },
  emergency: { label: "Emergency", variant: "destructive" },
  doctor_recall: { label: "Recall", variant: "outline" },
  follow_up_recall: { label: "Follow-up", variant: "outline" },
  admin_override: { label: "Priority", variant: "outline" },
};

export interface DoctorQueuePanelProps {
  onSelectPatient: (patient: QueuePatient) => void;
}

export function DoctorQueuePanel({ onSelectPatient }: DoctorQueuePanelProps) {
  // TODO: replace with real queue API + SSE subscription once
  // Suprita-iui's /queue endpoint is ready. Mock data for now.
  const rows = mockDoctorQueue;

  const waitingCount = rows.filter((r) => r.status === "waiting" || r.status === "called").length;
  const inConsultationCount = rows.filter((r) => r.status === "in_service").length;
  const completedCount = rows.filter((r) => r.status === "completed").length;

  const columns: DataTableColumn<QueuePatient>[] = [
    { key: "token", label: "Token", sortable: true, width: 90 },
    {
      key: "full_name",
      label: "Patient",
      sortable: true,
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{row.full_name}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{row.uhid}</Typography>
        </Box>
      ),
    },
    {
      key: "priorityType",
      label: "Priority",
      render: (row) => {
        const meta = PRIORITY_META[row.priorityType];
        return meta ? <Badge variant={meta.variant}>{meta.label}</Badge> : null;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "waitTimeMinutes",
      label: "Wait",
      sortable: true,
      align: "right",
      render: (row) => `${row.waitTimeMinutes} min`,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        <MetricCard label="Waiting" value={waitingCount} size="sm" />
        <MetricCard label="In Consultation" value={inConsultationCount} size="sm" />
        <MetricCard label="Completed Today" value={completedCount} size="sm" />
      </Box>

      <DataTable<QueuePatient>
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={onSelectPatient}
        emptyMessage="No patients in queue."
      />
    </Box>
  );
}