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
  Typography,
  Stack,
} from "@mui/material";

interface ClarificationDialogProps {
  open: boolean;
  doctor: string;
  onClose: () => void;
  onSubmit: (reason: string, message: string) => void;
}

const clarificationReasons = [
  "Unclear Dosage",
  "Missing Frequency",
  "Drug Interaction",
  "Allergy Concern",
  "Duplicate Medication",
  "Incorrect Strength",
  "Other",
];

export default function ClarificationDialog({
  open,
  doctor,
  onClose,
  onSubmit,
}: ClarificationDialogProps) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a clarification reason.");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message for the doctor.");
      return;
    }

    onSubmit(reason, message);

    setReason("");
    setMessage("");
  };

  const handleClose = () => {
    setReason("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Request Clarification</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography>
            <strong>Doctor:</strong> {doctor}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Reason</InputLabel>

            <Select
              value={reason}
              label="Reason"
              onChange={(e) => setReason(e.target.value)}
            >
              {clarificationReasons.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Message to Doctor"
            multiline
            rows={5}
            fullWidth
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what clarification is required..."
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}