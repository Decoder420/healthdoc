"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
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
  verification: PhysicalVerificationItem | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (
    verificationId: string,
    physicalQuantity: number,
    remarks: string
  ) => void;
}

export default function PhysicalVerificationDialog({
  open,
  verification,
  readOnly = false,
  onClose,
  onSave,
}: Props) {
  const [physicalQuantity, setPhysicalQuantity] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  useEffect(() => {
    if (!verification) {
      setPhysicalQuantity("");
      setRemarks("");
      return;
    }

    setPhysicalQuantity(
      verification.physical_quantity !== null &&
        verification.physical_quantity !== undefined
        ? String(verification.physical_quantity)
        : ""
    );

    setRemarks(
      verification.remarks ?? ""
    );
  }, [verification]);

  if (!verification) {
    return null;
  }

  const calculatedVariance =
    physicalQuantity === ""
      ? null
      : Number(physicalQuantity) -
        verification.system_quantity;

  const result =
    calculatedVariance === null
      ? null
      : calculatedVariance === 0
      ? "Matched"
      : "Variance Found";

  const handleSave = () => {
    if (physicalQuantity === "") {
      return;
    }

    onSave(
      verification.id,
      Number(physicalQuantity),
      remarks.trim()
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {readOnly
          ? "Physical Verification Details"
          : "Physical Verification"}
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          pt={1}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Verification ID
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

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {verification.item_id}
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
              {verification.batch_id ?? "—"}
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
                variant="h5"
                fontWeight={700}
              >
                {verification.system_quantity}
              </Typography>
            </Box>

            <TextField
              label="Physical Quantity"
              type="number"
              value={physicalQuantity}
              onChange={(event) =>
                setPhysicalQuantity(
                  event.target.value
                )
              }
              disabled={readOnly}
              required={!readOnly}
              fullWidth
            />
          </Box>

          {calculatedVariance !== null && (
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
                Variance
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                color={
                  calculatedVariance < 0
                    ? "error.main"
                    : calculatedVariance > 0
                    ? "success.main"
                    : "text.primary"
                }
              >
                {calculatedVariance > 0
                  ? "+"
                  : ""}
                {calculatedVariance}
              </Typography>
            </Box>
          )}

          {result && (
            <Box>
              <Chip
                label={result}
                color={
                  result === "Matched"
                    ? "success"
                    : "warning"
                }
              />
            </Box>
          )}

          <TextField
            label="Remarks"
            multiline
            minRows={3}
            value={remarks}
            onChange={(event) =>
              setRemarks(event.target.value)
            }
            disabled={readOnly}
            placeholder="Enter verification remarks..."
            fullWidth
          />

          {result === "Variance Found" &&
            !readOnly && (
              <Alert severity="warning">
                A stock variance has been detected.
                After completing verification, an
                adjustment can be submitted for dual
                sign-off.
              </Alert>
            )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          Close
        </Button>

        {!readOnly && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={physicalQuantity === ""}
          >
            Complete Verification
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}