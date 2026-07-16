"use client";

import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;

  title: string;

  description?: string;

  confirmText?: string;

  cancelText?: string;

  confirmColor?: ButtonProps["color"];

  loading?: boolean;

  onConfirm: () => void;

  onClose: () => void;
}

export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {description && (
          <Typography variant="body2">
            {description}
          </Typography>
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
          onClick={onConfirm}
          disabled={loading}
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