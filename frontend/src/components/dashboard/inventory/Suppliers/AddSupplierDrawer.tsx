"use client";

import { useState,useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";


interface Supplier {
  id: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gst: string;
  license: string;
  address: string;
  contactInfo: string;
  active: boolean;
}


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
  const [active, setActive] = useState(true);
 

  const [form, setForm] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    gst: "",
    license: "",
    address: "",
    contactInfo: "",
  });

  useEffect(() => {
  if (supplier) {
    setForm({
       supplierName: supplier.supplierName ?? "",
  contactPerson: supplier.contactPerson ?? "",
  phone: supplier.phone ?? "",
  email: supplier.email ?? "",
  gst: supplier.gst ?? "",
  license: supplier.license ?? "",
  address: supplier.address ?? "",
  contactInfo: supplier.contactInfo ?? "",
    });

    setActive(supplier.active);
  } else {
    setForm({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      gst: "",
      license: "",
      address: "",
      contactInfo: "",
    });

    setActive(true);
  }
}, [supplier, open]);

  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 900,
           minHeight: 760,
          maxWidth: "95vw",
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 28,
          fontWeight: 700,
          pb: 2,
        }}
      >
        {supplier ? "Edit Supplier" : "Add Supplier"}
      
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        <Stack spacing={5}>

          {/* ---------------- Basic Information ---------------- */}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 3 }}
            >
              Basic Information
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
               <TextField
  fullWidth
  variant="outlined"
  label="Supplier Name"
  value={form.supplierName ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      supplierName: e.target.value,
    })
  }
  InputLabelProps={{
    shrink: true,
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
  fullWidth
  label="Contact Person"
  value={form.contactPerson  ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      contactPerson: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/>
              </Grid>

              <Grid item xs={12} md={6}>
               <TextField
  fullWidth
  label="Phone Number"
  value={form.phone}
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/> 
              </Grid>

              <Grid item xs={12} md={6}>
              <TextField
  fullWidth
  label="Email Address"
  value={form.email ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      email: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/>  
              </Grid>

            </Grid>
          </Box>

          <Divider />

          {/* ---------------- Business Information ---------------- */}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 3 }}
            >
              Business Information
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <TextField
  fullWidth
  label="GST Number"
  value={form.gst ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      gst: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
  fullWidth
  label="Drug License Number"
  value={form.license ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      license: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/>
              </Grid>

              <Grid item xs={12}>
                <TextField
  fullWidth
  multiline
 
  label="Address"
  value={form.address ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      address: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}
sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}

/>
              </Grid>

              <Grid item xs={12}>
                <TextField
  fullWidth
  multiline

  label="Additional Contact Information"
  value={form.contactInfo ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      contactInfo: e.target.value,
    })
  }
  InputLabelProps={{ shrink: true }}

  sx={{
    "& .MuiOutlinedInput-root": {
      height: 58,
      borderRadius: 1,
    },
  }}
/>
              </Grid>

            </Grid>
          </Box>

          <Divider />

          {/* ---------------- Supplier Status ---------------- */}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Supplier Status
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              }
              label="Active Supplier"
            />
          </Box>

        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "flex-end",
          gap: 2,
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
  onClick={() => {
    if (!form.supplierName.trim()) {
      alert("Supplier Name is required");
      return;
    }

    onSave({
      id: supplier?.id ?? crypto.randomUUID(),
      supplierName: form.supplierName,
      contactPerson: form.contactPerson,
      phone: form.phone,
      email: form.email,
      gst: form.gst,
      license: form.license,
      address: form.address,
      contactInfo: form.contactInfo,
      active,
    });

    setForm({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      gst: "",
      license: "",
      address: "",
      contactInfo: "",
    });

    setActive(true);
    onClose();
  }}
>
  {supplier ? "Update Supplier" : "Save Supplier"}
</Button>

      </DialogActions>
    </Dialog>
  );
}