"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BedGrid from "@/components/BedGrid";
import { EMARTable } from "@/components/tables/EMARTable";
import { DataTable } from "@/components/tables/DataTable";
import VitalsTimeline from "@/components/VitalsTimeline";
import {
  Badge,
  ChartWrapper,
  ExportButton,
  MetricCard,
  Modal,
  StatusChip,
  toast,
} from "@/components/ui";
import { Button } from "@/components/ui/button";

const chartData = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 51 },
  { label: "Thu", value: 67 },
  { label: "Fri", value: 63 },
];

const tableRows = [
  { id: "1", patient: "Ravi Kumar", visit: "OPD", status: "waiting" as const },
  { id: "2", patient: "Sneha Patel", visit: "IPD", status: "in_progress" as const },
  { id: "3", patient: "Amit Shah", visit: "ER", status: "completed" as const },
];

export function SharedUiPreview() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Shared UI Gallery
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Temporary showcase of shared HealthDoc components. Safe to remove when
          review is complete.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's visits" value="128" delta="+12% vs yesterday" deltaPositive />
        <MetricCard label="Bed occupancy" value="84%" delta="6 beds vacant" />
        <MetricCard label="Pending labs" value="23" delta="5 overdue" deltaPositive={false} />
        <MetricCard label="Revenue" value="₹4.2L" delta="+8% this week" deltaPositive />
      </div>

      <ChartWrapper
        title="Daily OPD volume"
        description="Sample Recharts area chart inside ChartWrapper"
        actions={
          <ExportButton
            onExport={(format) => toast.success(`Exported as ${format.toUpperCase()}`)}
          />
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#001f54" fill="#001f54" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="flex flex-wrap items-center gap-3">
        <Badge>Default badge</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="muted">Muted</Badge>
        <StatusChip status="waiting" />
        <StatusChip status="completed" />
        <Button type="button" onClick={() => toast.success("Toast triggered")}>
          Show toast
        </Button>
        <Button type="button" variant="outline" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
      </div>

      <DataTable
        columns={[
          { id: "patient", label: "Patient", sortable: true, sortValue: (r) => r.patient, render: (r) => r.patient },
          { id: "visit", label: "Visit", render: (r) => r.visit },
          { id: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
        ]}
        rows={tableRows}
        rowKey={(r) => r.id}
      />

      <BedGrid
        beds={[
          { id: "b1", label: "A-101", ward: "General", status: "occupied", patientName: "Ravi Kumar" },
          { id: "b2", label: "A-102", ward: "General", status: "vacant" },
          { id: "b3", label: "B-201", ward: "ICU", status: "reserved" },
          { id: "b4", label: "B-202", ward: "ICU", status: "cleaning" },
        ]}
      />

      <VitalsTimeline
        readings={[
          {
            id: "v1",
            recordedAt: "09:00",
            temperature: "98.4°F",
            pulse: "78",
            bloodPressure: "120/80",
            spo2: "98%",
            respiratoryRate: "16",
            recordedBy: "Nurse Anjali",
          },
        ]}
      />

      <EMARTable
        rows={[
          {
            id: "e1",
            medication: "Paracetamol",
            dose: "500mg",
            route: "PO",
            scheduledAt: "10:00",
            status: "due",
            nurse: "Anjali Rao",
          },
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Sample modal"
        actions={
          <Button type="button" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          Shared modal dialog used across modules.
        </p>
      </Modal>
    </div>
  );
}
