"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import type { Supplier } from "@/features/inventory/types/supplier";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplier?: Supplier | null;
}

export default function AddSupplierDialog({
  open,
  onClose,
  onSave,
  supplier,
}: Props) {
  const [name, setName] =
    useState("");

  const [contactInfo, setContactInfo] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  /*
   * ============================================================
   * FORM RESET / EDIT DATA
   * ============================================================
   */

  useEffect(() => {
    if (supplier) {
      setName(
        supplier.name ?? ""
      );

      setContactInfo(
        supplier.contact_info ?? ""
      );

      setIsActive(
        supplier.is_active ?? true
      );
    } else {
      setName("");
      setContactInfo("");
      setIsActive(true);
    }
  }, [supplier, open]);

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  const handleSave = () => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      alert(
        "Supplier name is required."
      );

      return;
    }

    const newSupplier: Supplier = {
      id:
        supplier?.id ??
        `SUP-${Date.now()}`,

      name: trimmedName,

      contact_info:
        contactInfo.trim(),

      is_active: isActive,
    };

    onSave(newSupplier);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>
        {supplier
          ? "Edit Supplier"
          : "Add Supplier"}
      </DialogTitle>

      <DialogContent dividers>

        <Stack spacing={3}>

          {/* SUPPLIER INFORMATION */}

          <Box>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Supplier Information
            </Typography>

            <Stack spacing={2}>

              <TextField
                fullWidth
                label="Supplier Name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Contact Information"
                placeholder="Phone, email, contact person..."
                value={contactInfo}
                onChange={(event) =>
                  setContactInfo(
                    event.target.value
                  )
                }
              />

            </Stack>

          </Box>

          <Divider />

          {/* STATUS */}

          <Box>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              Supplier Status
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(
                      event.target.checked
                    )
                  }
                />
              }
              label={
                isActive
                  ? "Active Supplier"
                  : "Inactive Supplier"
              }
            />

          </Box>

        </Stack>

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >

        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          {supplier
            ? "Update Supplier"
            : "Save Supplier"}
        </Button>

      </DialogActions>

    </Dialog>
  );
}