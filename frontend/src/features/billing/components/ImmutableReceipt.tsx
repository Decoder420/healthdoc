"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { FACILITY_DISPLAY_NAME, PAYMENT_MODE_LABELS } from "../constants";
import { formatINR } from "../lib/formatters";
import type { InvoiceWithItems, PaymentWithRefunds } from "../types";
import { PaymentStatusChip } from "./PaymentStatusChip";

type Props = {
  payment: PaymentWithRefunds;
  invoice: InvoiceWithItems;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2, py: 0.5 }}>
      <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: meridian.textPrimary, textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function ImmutableReceipt({ payment, invoice }: Props) {
  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${meridian.border}`,
        background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
        p: 2.5,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2, gap: 2 }}>
        <Box>
          <Typography sx={{ m: 0, fontSize: "1.0625rem", fontWeight: 700, color: meridian.textPrimary }}>
            Receipt (immutable)
          </Typography>
          <Typography sx={{ m: 0, mt: 0.35, fontSize: "0.75rem", color: meridian.textSecondary }}>
            Financial fields cannot be edited after collection
          </Typography>
        </Box>
        <PaymentStatusChip status={payment.status} />
      </Stack>

      <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary, mb: 1.5 }}>
        {FACILITY_DISPLAY_NAME}
      </Typography>

      <Row label="Receipt #" value={payment.receipt_number} />
      <Row label="Invoice #" value={invoice.invoice_number} />
      <Row
        label="Patient"
        value={`${invoice.patient?.name ?? invoice.patient_id} (${invoice.patient?.uhid ?? "—"})`}
      />
      <Row label="Amount" value={formatINR(payment.amount)} />
      <Row label="Mode" value={PAYMENT_MODE_LABELS[payment.mode]} />
      <Row label="Collected by" value={payment.collected_by} />
      <Row
        label="Collected at"
        value={new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(payment.collected_at))}
      />
      {payment.reference_txn_id ? (
        <Row label="Reference" value={payment.reference_txn_id} />
      ) : null}
      {payment.notes ? <Row label="Notes" value={payment.notes} /> : null}

      {payment.refunds.length > 0 ? (
        <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${meridian.border}` }}>
          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, mb: 1 }}>Refunds</Typography>
          {payment.refunds.map((r) => (
            <Typography key={r.id} sx={{ fontSize: "0.75rem", color: meridian.textSecondary, mb: 0.5 }}>
              {r.refund_number} · {formatINR(r.amount)} · {r.reason}
            </Typography>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
