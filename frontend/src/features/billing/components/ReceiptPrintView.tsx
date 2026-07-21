"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Modal } from "@/components/ui/Modal";
import { FACILITY_DISPLAY_NAME, PAYMENT_MODE_LABELS } from "../constants";
import { formatINR } from "../lib/formatters";
import type { InvoiceWithItems, PaymentWithRefunds } from "../types";
import { ImmutableReceipt } from "./ImmutableReceipt";

type Props = {
  open: boolean;
  payment: PaymentWithRefunds | null;
  invoice: InvoiceWithItems | null;
  onClose: () => void;
  onPrint: () => void;
};

export function ReceiptPrintView({ open, payment, invoice, onClose, onPrint }: Props) {
  if (!payment || !invoice) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Print receipt"
      size="md"
      actions={
        <>
          <Button onClick={onClose} className="no-print" sx={{ textTransform: "none" }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={onPrint}
            className="no-print"
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px" }}
          >
            Print
          </Button>
        </>
      }
    >
      <Box id="receipt-print-root" className="receipt-print-root">
        <Stack spacing={0.5} sx={{ mb: 2, textAlign: "center" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
            {FACILITY_DISPLAY_NAME}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem" }}>Payment receipt</Typography>
          <Typography sx={{ fontSize: "0.75rem" }}>
            {PAYMENT_MODE_LABELS[payment.mode]} · {formatINR(payment.amount)}
          </Typography>
        </Stack>
        <ImmutableReceipt payment={payment} invoice={invoice} />
        <Typography sx={{ mt: 2, fontSize: "0.75rem", textAlign: "center" }}>
          This is a computer-generated receipt.
        </Typography>
      </Box>
    </Modal>
  );
}
