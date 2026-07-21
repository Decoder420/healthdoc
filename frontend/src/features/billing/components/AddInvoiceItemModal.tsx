"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Modal } from "@/components/ui/Modal";
import { CHARGE_CATEGORY_LABELS } from "../constants";
import type { ChargeCategory } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (body: {
    charge_category: ChargeCategory;
    description: string;
    quantity: number;
    unit_price: number;
  }) => Promise<void> | void;
};

const CATEGORIES = Object.keys(CHARGE_CATEGORY_LABELS) as ChargeCategory[];

export function AddInvoiceItemModal({ open, onClose, onSave }: Props) {
  const [charge_category, setCategory] = useState<ChargeCategory>("other");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit_price, setUnitPrice] = useState(0);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCategory("other");
    setDescription("");
    setQuantity(1);
    setUnitPrice(0);
  };

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!description.trim() || quantity <= 0 || unit_price < 0) return;
    setSaving(true);
    try {
      await onSave({
        charge_category,
        description: description.trim(),
        quantity,
        unit_price,
      });
      reset();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add invoice item"
      size="sm"
      loading={saving}
      actions={
        <>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={!description.trim() || quantity <= 0}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px" }}
          >
            Add
          </Button>
        </>
      }
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <TextField
          select
          label="Charge category"
          value={charge_category}
          onChange={(e) => setCategory(e.target.value as ChargeCategory)}
          fullWidth
          size="small"
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {CHARGE_CATEGORY_LABELS[c]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          size="small"
        />
        <Stack direction="row" spacing={2}>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            slotProps={{ htmlInput: { min: 0.01, step: 1 } }}
            fullWidth
            size="small"
          />
          <TextField
            type="number"
            label="Unit price (₹)"
            value={unit_price}
            onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            fullWidth
            size="small"
          />
        </Stack>
      </Stack>
    </Modal>
  );
}
