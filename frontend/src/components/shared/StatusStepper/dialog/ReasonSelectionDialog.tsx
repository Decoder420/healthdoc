"use client";

import { useEffect, useState } from "react";

import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

export interface ReasonOption {
  label: string;
  value: string;
}

interface ReasonSelectionDialogProps {
  open: boolean;

  title: string;

  label?: string;

  reasons: ReasonOption[];

  defaultValue?: string;

  loading?: boolean;

  confirmText?: string;

  cancelText?: string;

  confirmColor?: ButtonProps["color"];

  /** Optional helper text shown below the dropdown */
  helperText?: string;

  /** Show remarks field */
  showRemarks?: boolean;

  /** Default remarks value */
  defaultRemarks?: string;

  /** Remarks label */
  remarksLabel?: string;

  onClose: () => void;

  onConfirm: (data: {
    reason: string;
    remarks?: string;
  }) => void;
}

export default function ReasonSelectionDialog({
  open,
  title,
  label = "Reason",
  reasons,
  defaultValue = "",
  loading = false,
  confirmText = "Save",
  cancelText = "Cancel",
  confirmColor = "primary",
  helperText,
  showRemarks = false,
  defaultRemarks = "",
  remarksLabel = "Remarks",
  onClose,
  onConfirm,
}: ReasonSelectionDialogProps) {
  const [reason, setReason] = useState(defaultValue);
  const [remarks, setRemarks] = useState(defaultRemarks);

  useEffect(() => {
    if (open) {
      setReason(defaultValue);
      setRemarks(defaultRemarks);
    }
  }, [open, defaultValue, defaultRemarks]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <TextField
          select
          fullWidth
          margin="normal"
          label={label}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {reasons.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </TextField>

        {helperText && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {helperText}
          </Typography>
        )}

        {showRemarks && (
          <TextField
            fullWidth
            multiline
            minRows={3}
            margin="normal"
            label={remarksLabel}
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          disabled={!reason || loading}
          onClick={() =>
            onConfirm({
              reason,
              remarks: showRemarks
                ? remarks
                : undefined,
            })
          }
          sx={{
            textTransform: "none",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}