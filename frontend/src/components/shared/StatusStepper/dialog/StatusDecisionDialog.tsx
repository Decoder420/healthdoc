"use client";

import { useEffect, useState } from "react";

import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

export interface DecisionOption {
  label: string;
  value: string;
}

interface StatusDecisionDialogProps {
  open: boolean;

  title: string;

  description?: string;

  options: DecisionOption[];

  defaultValue?: string;

  loading?: boolean;

  confirmText?: string;

  cancelText?: string;

  confirmColor?: ButtonProps["color"];

  onClose: () => void;

  onConfirm: (value: string) => void;
}

export default function StatusDecisionDialog({
  open,
  title,
  description,
  options,
  defaultValue = "",
  loading = false,
  confirmText = "Continue",
  cancelText = "Cancel",
  confirmColor = "primary",
  onClose,
  onConfirm,
}: StatusDecisionDialogProps) {
  const [selected, setSelected] =
    useState(defaultValue);

  useEffect(() => {
    if (open) {
      setSelected(defaultValue);
    }
  }, [open, defaultValue]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {description}
          </Typography>
        )}

        <RadioGroup
          value={selected}
          onChange={(e) =>
            setSelected(e.target.value)
          }
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
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
          disabled={!selected || loading}
          onClick={() =>
            onConfirm(selected)
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