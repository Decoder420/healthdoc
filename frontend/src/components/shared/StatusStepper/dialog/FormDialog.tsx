"use client";

import { ReactNode } from "react";

import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface FormDialogProps {
  open: boolean;

  title: string;

  children: ReactNode;

  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";

  loading?: boolean;

  saveText?: string;

  cancelText?: string;

  saveColor?: ButtonProps["color"];

  disableSave?: boolean;

  onClose: () => void;

  onSave: () => void;
}

export default function FormDialog({
  open,
  title,
  children,
  maxWidth = "sm",
  loading = false,
  saveText = "Save",
  cancelText = "Cancel",
  saveColor = "primary",
  disableSave = false,
  onClose,
  onSave,
}: FormDialogProps) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={maxWidth}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {children}
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
          color={saveColor}
          disabled={disableSave || loading}
          onClick={onSave}
          sx={{
            textTransform: "none",
          }}
        >
          {saveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}