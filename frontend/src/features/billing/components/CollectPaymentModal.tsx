"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Modal } from "@/components/ui/Modal";
import { PAYMENT_MODE_LABELS } from "../constants";
import type { CollectPaymentInput, PaymentMode } from "../types";

type Props = {
  open: boolean;
  balanceDue: number;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (body: CollectPaymentInput) => Promise<void> | void;
};

const MODES = Object.keys(PAYMENT_MODE_LABELS) as PaymentMode[];

export function CollectPaymentModal({
  open,
  balanceDue,
  busy,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState(balanceDue);
  const [mode, setMode] = useState<PaymentMode>("cash");
  const [reference_txn_id, setRef] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setAmount(balanceDue);
      setMode("cash");
      setRef("");
      setNotes("");
    }
  }, [open, balanceDue]);

  const handleSave = async () => {
    if (amount <= 0 || amount > balanceDue + 0.001) return;
    await onSubmit({
      amount,
      mode,
      reference_txn_id: reference_txn_id.trim() || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Collect payment"
      size="sm"
      loading={busy}
      actions={
        <>
          <Button onClick={onClose} sx={{ textTransform: "none" }} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={busy || amount <= 0 || amount > balanceDue + 0.001}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px" }}
          >
            Collect
          </Button>
        </>
      }
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <TextField
          type="number"
          label="Amount (₹)"
          size="small"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          slotProps={{ htmlInput: { min: 0, step: 1, max: balanceDue } }}
          helperText={`Balance due: ₹${balanceDue.toFixed(2)}`}
          fullWidth
        />
        <TextField
          select
          label="Mode"
          size="small"
          value={mode}
          onChange={(e) => setMode(e.target.value as PaymentMode)}
          fullWidth
        >
          {MODES.map((m) => (
            <MenuItem key={m} value={m}>
              {PAYMENT_MODE_LABELS[m]}
            </MenuItem>
          ))}
        </TextField>
        {(mode === "upi" || mode === "card" || mode === "netbanking") && (
          <TextField
            label="Reference / txn id"
            size="small"
            value={reference_txn_id}
            onChange={(e) => setRef(e.target.value)}
            fullWidth
          />
        )}
        <TextField
          label="Notes"
          size="small"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
      </Stack>
    </Modal>
  );
}
