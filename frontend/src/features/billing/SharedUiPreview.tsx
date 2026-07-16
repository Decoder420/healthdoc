"use client";

/**
 * TEMPORARY gallery of all shared components.
 * Delete this file + remove usage from app/billing/page.tsx when done reviewing.
 */

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartWrapper,
  ExportButton,
  MetricCard,
} from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { StatusChip } from "@/components/ui/StatusChip";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import BedGrid from "@/components/BedGrid";
import type { Bed } from "@/components/BedGrid";
import VitalsTimeline from "@/components/VitalsTimeline";
import type { VitalRecord } from "@/components/VitalsTimeline";
import EMARTable from "@/components/tables/EMARTable";
import type { MedicationRecord } from "@/components/tables/EMARTable";
import { meridian } from "@/styles/theme";

const chartData = [
  { day: "Mon", revenue: 42000 },
  { day: "Tue", revenue: 51000 },
  { day: "Wed", revenue: 48000 },
  { day: "Thu", revenue: 62000 },
  { day: "Fri", revenue: 58000 },
  { day: "Sat", revenue: 35000 },
  { day: "Sun", revenue: 29000 },
];

type InvoiceRow = {
  id: string;
  patient: string;
  amount: number;
  status: string;
};

const invoiceRows: InvoiceRow[] = [
  { id: "INV-1001", patient: "Ravi Kumar", amount: 1200, status: "completed" },
  { id: "INV-1002", patient: "Sita Devi", amount: 845, status: "pharmacy_pending" },
  { id: "INV-1003", patient: "Aman Singh", amount: 2300, status: "waiting" },
  { id: "INV-1004", patient: "Neha Shah", amount: 990, status: "cancelled" },
];

const beds: Bed[] = [
  {
    id: "b1",
    bedNumber: "ICU-01",
    patientName: "Ravi Kumar",
    status: "Occupied",
    wardName: "ICU",
  },
  {
    id: "b2",
    bedNumber: "ICU-02",
    status: "Vacant",
    wardName: "ICU",
  },
  {
    id: "b3",
    bedNumber: "GW-12",
    patientName: "Sita Devi",
    status: "Occupied",
    wardName: "General",
  },
  {
    id: "b4",
    bedNumber: "GW-13",
    status: "Cleaning",
    wardName: "General",
  },
  {
    id: "b5",
    bedNumber: "PR-03",
    status: "Reserved",
    wardName: "Private",
  },
];

const vitals: VitalRecord[] = [
  {
    id: "v1",
    recordedAt: "2026-07-15 08:00",
    temperature: 98.6,
    pulse: 78,
    respiratoryRate: 16,
    bloodPressure: "120/80",
    oxygenSaturation: 98,
    recordedBy: "Nurse Asha",
  },
  {
    id: "v2",
    recordedAt: "2026-07-15 12:00",
    temperature: 99.1,
    pulse: 88,
    respiratoryRate: 18,
    bloodPressure: "128/84",
    oxygenSaturation: 97,
    recordedBy: "Nurse Aman",
  },
  {
    id: "v3",
    recordedAt: "2026-07-15 16:00",
    temperature: 98.4,
    pulse: 76,
    respiratoryRate: 15,
    bloodPressure: "118/76",
    oxygenSaturation: 99,
    recordedBy: "Nurse Asha",
  },
];

const medications: MedicationRecord[] = [
  {
    id: "m1",
    medicationName: "Paracetamol",
    dosage: "500 mg",
    route: "Oral",
    scheduledTime: "08:00",
    administeredBy: "Nurse Asha",
    status: "Administered",
  },
  {
    id: "m2",
    medicationName: "Amoxicillin",
    dosage: "250 mg",
    route: "Oral",
    scheduledTime: "12:00",
    status: "Scheduled",
  },
  {
    id: "m3",
    medicationName: "Insulin",
    dosage: "10 units",
    route: "SC",
    scheduledTime: "18:00",
    administeredBy: "Nurse Aman",
    status: "Held",
  },
  {
    id: "m4",
    medicationName: "ORS",
    dosage: "1 sachet",
    route: "Oral",
    scheduledTime: "10:00",
    status: "Missed",
  },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.75,
      }}
    >
      <Box>
        <Typography
          sx={{
            m: 0,
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: meridian.textPrimary,
          }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography
            sx={{
              m: 0,
              mt: 0.4,
              fontSize: "0.8125rem",
              color: meridian.textSecondary,
            }}
          >
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Box>
  );
}

export function SharedUiPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo<DataTableColumn<InvoiceRow>[]>(
    () => [
      { key: "id", label: "Invoice", sortable: true, width: "18%" },
      { key: "patient", label: "Patient", sortable: true },
      {
        key: "amount",
        label: "Amount",
        sortable: true,
        align: "right",
        width: 120,
        render: (row) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(row.amount),
      },
      {
        key: "status",
        label: "Status",
        width: 168,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 2, pb: 4 }}>
      <Box>
        <Typography
          component="p"
          sx={{
            m: 0,
            mb: 0.75,
            display: "inline-flex",
            px: 1.1,
            py: 0.35,
            borderRadius: "999px",
            fontSize: "0.6875rem",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: meridian.brandPrimary,
            backgroundColor: meridian.muted,
            border: "1px solid rgb(0 31 84 / 0.1)",
          }}
        >
          Temporary shared-component gallery
        </Typography>
        <Typography
          component="h2"
          sx={{
            m: 0,
            fontSize: "1.4rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: meridian.textPrimary,
          }}
        >
          All shared UI on Billing
        </Typography>
      </Box>

      <Section title="MetricCard" description="KPI tiles with delta / icon">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          <MetricCard
            label="Today's collections"
            value="₹1,28,400"
            delta={{ value: 12.4, direction: "up", label: "%" }}
            icon={<PaymentsOutlinedIcon />}
          />
          <MetricCard
            label="Pending invoices"
            value={47}
            unit="bills"
            delta={{ value: 3, direction: "down", label: "vs yesterday" }}
            icon={<ReceiptLongOutlinedIcon />}
          />
          <MetricCard
            label="OPD fee revenue"
            value="₹64,200"
            delta={{ value: 0, direction: "neutral", label: "no change" }}
            icon={<LocalHospitalOutlinedIcon />}
          />
        </Box>
      </Section>

      <Section title="ChartWrapper + ExportButton">
        <ChartWrapper
          title="Weekly revenue"
          description="Sample area chart inside the chart shell"
          height={300}
          actions={
            <ExportButton
              onExport={async (format) => {
                toast.info(`Export requested`, `Format: ${format.toUpperCase()}`);
              }}
            />
          }
        >
          <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 4 }}>
            <defs>
              <linearGradient id="previewRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={meridian.brandPrimary} stopOpacity={0.28} />
                <stop offset="100%" stopColor={meridian.brandPrimary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickMargin={8}
              tickFormatter={(v) =>
                typeof v === "number" ? `${Math.round(v / 1000)}k` : String(v)
              }
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={meridian.brandPrimary}
              strokeWidth={2.5}
              fill="url(#previewRevenue)"
            />
          </AreaChart>
        </ChartWrapper>
      </Section>

      <Section title="Badge + StatusChip">
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={1.25}
          sx={{ gap: 1.25 }}
        >
          <Badge>New</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Critical</Badge>
          <Badge variant="outline">Outline</Badge>
          <StatusChip status="waiting" />
          <StatusChip status="in_consultation" />
          <StatusChip status="pharmacy_pending" />
          <StatusChip status="completed" />
          <StatusChip status="cancelled" />
        </Stack>
      </Section>

      <Section title="Modal + Toast">
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={1.25}
          sx={{ gap: 1.25 }}
        >
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Button variant="outlined" onClick={() => toast.success("Bill saved", "Invoice INV-1001")}>
            Toast success
          </Button>
          <Button variant="outlined" color="error" onClick={() => toast.error("Payment failed")}>
            Toast error
          </Button>
          <Button variant="outlined" color="warning" onClick={() => toast.warning("Low stock")}>
            Toast warning
          </Button>
          <Button variant="outlined" onClick={() => toast.info("Queue updated")}>
            Toast info
          </Button>
        </Stack>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm payment"
          size="sm"
          actions={
            <>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setModalOpen(false);
                  toast.success("Payment confirmed");
                }}
              >
                Confirm
              </Button>
            </>
          }
        >
          <Typography sx={{ color: meridian.textSecondary, fontSize: "0.9rem" }}>
            Sample modal body — use for confirmations, forms, and detail views.
          </Typography>
        </Modal>
      </Section>

      <Section title="DataTable" description="Sortable invoice list with StatusChip cells">
        <DataTable
          columns={columns}
          rows={invoiceRows}
          getRowId={(row) => row.id}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={invoiceRows.length}
          onPageChange={setPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10]}
        />
      </Section>

      <Section title="BedGrid">
        <BedGrid beds={beds} />
      </Section>

      <Section title="VitalsTimeline">
        <VitalsTimeline records={vitals} />
      </Section>

      <Section title="EMARTable">
        <EMARTable medications={medications} />
      </Section>
    </Box>
  );
}
