"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";

interface HoldPrescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, notes: string) => void;
}

const holdReasons = [
  "Medicine Out of Stock",
  "Insurance Approval Pending",
  "Patient Requested Delay",
  "Prescription Incomplete",
  "Awaiting Doctor Confirmation",
  "Other",
];

export default function HoldPrescriptionDialog({
  open,
  onClose,
  onSubmit,
}: HoldPrescriptionDialogProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a reason.");
      return;
    }

    onSubmit(reason, notes);

    setReason("");
    setNotes("");
  };

  const handleClose = () => {
    setReason("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Put Prescription On Hold</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Reason</InputLabel>

            <Select
              value={reason}
              label="Reason"
              onChange={(e) => setReason(e.target.value)}
            >
              {holdReasons.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            multiline
            rows={4}
            label="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={handleSubmit}
        >
          Put On Hold
        </Button>
      </DialogActions>
    </Dialog>
  );
}