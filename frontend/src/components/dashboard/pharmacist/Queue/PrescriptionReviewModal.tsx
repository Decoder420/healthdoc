"use client";

import { useState } from "react";
import HoldPrescriptionDialog from "./HoldPrescriptionDialog";
import ClarificationDialog from "./ClarificationDialog";
import type { QueueStatus } from "@/features/pharmacy/types";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  
  TextField,
  Chip,
  Divider,
  Grid,
} from "@mui/material";


import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";




interface Props {
  open: boolean;
  prescription: any;
  onClose: () => void;
  onStatusChange: (
    id: string,
    status: QueueStatus,
    details?: {
      holdReason?: string;
      holdNotes?: string;
      clarificationReason?: string;
      clarificationMessage?: string;
      pharmacistNotes?: string;
    }
  ) => void;
}



export default function PrescriptionReviewModal({
  open,
  prescription,
  onClose,
  onStatusChange,
}: Props) {
  
  const [notes, setNotes] = useState("");

const [holdOpen, setHoldOpen] = useState(false);

const [clarifyOpen, setClarifyOpen] = useState(false);

  if (!prescription) return null;

  

  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Prescription Review
      </DialogTitle>

      <DialogContent dividers>

        {/* Patient Details */}

        <Typography variant="h6" gutterBottom>
          Patient Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
  <Grid item xs={12} md={6}>
    <Typography>
      <strong>Patient:</strong> {prescription.patientName}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography>
      <strong>UHID:</strong> {prescription.uhid}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography>
      <strong>Doctor:</strong> {prescription.doctor}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography>
      <strong>Visit:</strong> {prescription.visit}
    </Typography>
  </Grid>
</Grid>

        <Divider sx={{ my: 3 }} />

        {/* Medication */}
<Typography variant="h6" gutterBottom>
  Medication List
</Typography>
         <TableContainer component={Paper} variant="outlined">
  <Table>

    <TableHead>
      <TableRow>
        <TableCell><strong>Medicine</strong></TableCell>
        <TableCell><strong>Dose</strong></TableCell>
        <TableCell align="center"><strong>Qty</strong></TableCell>
        <TableCell align="center"><strong>Stock</strong></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>

      <TableRow>
        <TableCell>Paracetamol</TableCell>
        <TableCell>500 mg</TableCell>
        <TableCell align="center">10</TableCell>
        <TableCell align="center">
          <Chip label="Available" color="success" size="small" />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Vitamin C</TableCell>
        <TableCell>500 mg</TableCell>
        <TableCell align="center">15</TableCell>
        <TableCell align="center">
          <Chip label="Out of Stock" color="error" size="small" />
        </TableCell>
      </TableRow>

    </TableBody>

  </Table>
</TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Alerts */}

        <Typography variant="h6">
          Clinical Alerts
        </Typography>

        <Chip
          label="Penicillin Allergy"
          color="warning"
          sx={{ mt: 1 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Notes */}

        <Typography variant="h6">
          Pharmacist Notes
        </Typography>

        <TextField
    multiline
    rows={4}
    fullWidth
    label="Pharmacist Notes"
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
/>
        
      </DialogContent>

      <DialogActions>

        <Button
    color="warning"
    variant="outlined"
    onClick={() => setHoldOpen(true)}
>
    Hold
</Button>

        <Button
          color="secondary"
          variant="outlined"
          onClick={() => setClarifyOpen(true)}
        >
          Clarify
        </Button>

        <Button
  variant="contained"
  color="primary"
  onClick={() => {

        onStatusChange(
  prescription.id,
  "Approved",
  {
    pharmacistNotes: notes,
  }
);

onClose();
    }}
>
    Approve 
</Button>

      </DialogActions>

    </Dialog>

<HoldPrescriptionDialog
      open={holdOpen}
      onClose={() => setHoldOpen(false)}
      onSubmit={(reason, holdNotes) => {
        onStatusChange(prescription.id, "On Hold", {
          holdReason: reason,
          holdNotes,
          pharmacistNotes: notes,
        });

        setHoldOpen(false);
        onClose();
      }}
    />

    <ClarificationDialog
      open={clarifyOpen}
      doctor={prescription.doctor}
      onClose={() => setClarifyOpen(false)}
      onSubmit={(reason, message) => {
        onStatusChange(prescription.id, "Clarification Pending", {
          clarificationReason: reason,
          clarificationMessage: message,
          pharmacistNotes: notes,
        });

        setClarifyOpen(false);
        onClose();
      }}
    />
  </>

  );
}