"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { interactionWarnings } from "@/features/pharmacy/data/dashboardData";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InteractionDialog({
  open,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Drug Interaction Alerts
      </DialogTitle>

      <DialogContent dividers>
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Patient</th>
              <th>UHID</th>
              <th>Prescription</th>
              <th>Interaction</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {interactionWarnings.map((item) => (
              <tr key={item.id}>
                <td>{item.patient}</td>
                <td>{item.uhid}</td>
                <td>{item.prescription}</td>
                <td>{item.interaction}</td>
                <td>{item.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}