
"use client";

import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import {
  generateAdjustmentId,
  getStockAdjustments,
  saveStockAdjustments,
} from "@/features/inventory/data/stockAdjustmentData";

import type { StockAdjustment } from "@/features/inventory/types/stockAdjustment";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function StockAdjustmentDialog({
  open,
  onClose,
  onCreated,
}: Props) {
  const [itemId, setItemId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [systemQuantity, setSystemQuantity] = useState("");
  const [physicalQuantity, setPhysicalQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const adjustmentQuantity =
    systemQuantity !== "" && physicalQuantity !== ""
      ? Number(physicalQuantity) - Number(systemQuantity)
      : 0;

  const resetForm = () => {
    setItemId("");
    setBatchId("");
    setSystemQuantity("");
    setPhysicalQuantity("");
    setReason("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    setError("");

    if (!itemId.trim()) {
      setError("Item ID is required.");
      return;
    }

    if (systemQuantity === "" || physicalQuantity === "") {
      setError("System and physical quantities are required.");
      return;
    }

    const systemQty = Number(systemQuantity);
    const physicalQty = Number(physicalQuantity);

    if (
      !Number.isFinite(systemQty) ||
      !Number.isFinite(physicalQty)
    ) {
      setError("Quantities must be valid numbers.");
      return;
    }

    if (systemQty < 0 || physicalQty < 0) {
      setError("Quantities cannot be negative.");
      return;
    }

    if (adjustmentQuantity === 0) {
      setError(
        "No adjustment is required because quantities match."
      );
      return;
    }

    if (!reason.trim()) {
      setError("Adjustment reason is required.");
      return;
    }

    const adjustment: StockAdjustment = {
      id: generateAdjustmentId(),

      item_id: itemId.trim(),
      batch_id: batchId.trim() || null,

      system_quantity: systemQty,
      physical_quantity: physicalQty,
      adjustment_quantity: adjustmentQuantity,

      reason: reason.trim(),

      requested_by: "USR-005",
      requested_at: new Date().toISOString(),

      status: "Pending Approval",

      first_approved_by: null,
      first_approved_at: null,

      second_approved_by: null,
      second_approved_at: null,

      rejection_reason: null,
    };

    const existing = getStockAdjustments();

    saveStockAdjustments([...existing, adjustment]);

    onCreated();

    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Create Stock Adjustment
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          pt={1}
        >
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            label="Item ID"
            value={itemId}
            onChange={(event) =>
              setItemId(event.target.value)
            }
            fullWidth
            required
          />

          <TextField
            label="Batch ID"
            value={batchId}
            onChange={(event) =>
              setBatchId(event.target.value)
            }
            fullWidth
          />

          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap={2}
          >
            <TextField
              label="System Quantity"
              type="number"
              value={systemQuantity}
              onChange={(event) =>
                setSystemQuantity(event.target.value)
              }
              inputProps={{ min: 0 }}
              fullWidth
              required
            />

            <TextField
              label="Physical Quantity"
              type="number"
              value={physicalQuantity}
              onChange={(event) =>
                setPhysicalQuantity(event.target.value)
              }
              inputProps={{ min: 0 }}
              fullWidth
              required
            />
          </Box>

          <Divider />

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Adjustment Quantity
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
              color={
                adjustmentQuantity > 0
                  ? "success.main"
                  : adjustmentQuantity < 0
                    ? "error.main"
                    : "text.primary"
              }
            >
              {adjustmentQuantity > 0 ? "+" : ""}
              {adjustmentQuantity}
            </Typography>
          </Box>

          <TextField
            label="Reason"
            multiline
            minRows={3}
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Explain why the stock adjustment is required..."
            fullWidth
            required
          />

          <Alert severity="info">
            This adjustment will be submitted for dual
            sign-off. Stock will not change until another
            authorized user approves it.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Submit for Approval
        </Button>
      </DialogActions>
    </Dialog>
  );
}

