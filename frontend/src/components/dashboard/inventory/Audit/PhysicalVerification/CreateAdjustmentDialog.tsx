"use client";

import {
  useEffect,
  useState,
} from "react";

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

import type {
  PhysicalVerificationItem,
} from "@/features/inventory/types/physicalVerification";

interface Props {
  open: boolean;

  verification:
    | PhysicalVerificationItem
    | null;

  onClose: () => void;

  onSubmit: (
    verification: PhysicalVerificationItem,
    reason: string
  ) => void;
}

export default function CreateAdjustmentDialog({
  open,
  verification,
  onClose,
  onSubmit,
}: Props) {
  const [reason, setReason] =
    useState(
      "Physical verification variance"
    );

  useEffect(() => {
    if (open) {
      setReason(
        "Physical verification variance"
      );
    }
  }, [open]);

  if (!verification) {
    return null;
  }

  const variance =
    verification.variance ?? 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <Alert severity="warning">
            This will create a pending stock
            adjustment. Stock will not be
            changed until the adjustment passes
            the dual sign-off process.
          </Alert>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Physical Verification
            </Typography>

            <Typography fontWeight={700}>
              {verification.id}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Item
            </Typography>

            <Typography fontWeight={600}>
              {verification.item_name}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Batch
            </Typography>

            <Typography>
              {verification.batch_id ??
                "—"}
            </Typography>
          </Box>

          <Divider />

          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap={2}
          >
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
                System Quantity
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {verification.system_quantity}
              </Typography>
            </Box>

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
                Physical Quantity
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {verification.physical_quantity}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                variance < 0
                  ? "error.lighter"
                  : "success.lighter",
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
                variance < 0
                  ? "error.main"
                  : "success.main"
              }
            >
              {variance > 0
                ? "+"
                : ""}
              {variance}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Signed quantity: positive =
              stock increase, negative = stock
              decrease
            </Typography>
          </Box>

          <TextField
            label="Reason"
            value={reason}
            onChange={(event) =>
              setReason(
                event.target.value
              )
            }
            multiline
            minRows={2}
            fullWidth
            required
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
  variant="contained"
  color="warning"
  disabled={!reason.trim() || variance === 0}
  onClick={() =>
    onSubmit(
      verification,
      reason.trim()
    )
  }
>
  Submit for Approval
</Button>
      </DialogActions>
    </Dialog>
  );
}