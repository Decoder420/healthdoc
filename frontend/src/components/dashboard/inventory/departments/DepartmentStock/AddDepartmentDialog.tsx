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
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { DepartmentStock } from "@/features/inventory/types/type";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (department: DepartmentStock) => void;
  department?: DepartmentStock | null;
}

export default function AddDepartmentDialog({
  open,
  onClose,
  onSave,
  department,
}: Props) {
  const [active, setActive] = useState(true);

  const [form, setForm] = useState({
    departmentName: "",
    departmentType: "Pharmacy" as DepartmentStock["departmentType"],
    manager: "",
    totalItems: "",
    lowStockItems: "",
    stockValue: "",
    updated: "Today",
  });

  useEffect(() => {
    if (department) {
      setForm({
        departmentName: department.departmentName,
        departmentType: department.departmentType,
        manager: department.manager,
        totalItems: department.totalItems.toString(),
        lowStockItems: department.lowStockItems.toString(),
        stockValue: department.stockValue.toString(),
        updated: department.updated,
      });

      setActive(department.active);
    } else {
      setForm({
        departmentName: "",
        departmentType: "Pharmacy",
        manager: "",
        totalItems: "",
        lowStockItems: "",
        stockValue: "",
        updated: "Today",
      });

      setActive(true);
    }
  }, [department, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 900,
          minHeight: 720,
          maxWidth: "95vw",
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {department ? "Edit Department" : "Add Department"}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        <Stack spacing={5}>

          {/* Basic Information */}

          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Department Information
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department Name"
                  value={form.departmentName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      departmentName: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Department Type"
                  value={form.departmentType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      departmentType:
                        e.target.value as DepartmentStock["departmentType"],
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                    },
                  }}
                >
                  <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                  <MenuItem value="Radiology">Radiology</MenuItem>
                  <MenuItem value="Laboratory">Laboratory</MenuItem>
                  <MenuItem value="Blood Bank">Blood Bank</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Operation Theatre">
                    Operation Theatre
                  </MenuItem>
                  <MenuItem value="Ward">Ward</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Department Manager"
                  value={form.manager}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      manager: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                    },
                  }}
                />
              </Grid>

            </Grid>
          </Box>

          <Divider />

          {/* Inventory Summary */}

          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Inventory Summary
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Items"
                  value={form.totalItems}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      totalItems: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                   sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                    },
                  }}

                
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Low Stock Items"
                  value={form.lowStockItems}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lowStockItems: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                   sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock Value"
                  value={form.stockValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stockValue: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                   sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                    },
                  }}
                />
              </Grid>

            </Grid>
          </Box>

          <Divider />

          {/* Status */}

          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Department Status
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              }
              label="Active Department"
            />
          </Box>

        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 2,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            if (!form.departmentName.trim()) {
              alert("Department Name is required");
              return;
            }

            onSave({
              id: department?.id ?? crypto.randomUUID(),

              departmentName: form.departmentName,

              departmentType: form.departmentType,

              manager: form.manager,

              totalItems: Number(form.totalItems),

              lowStockItems: Number(form.lowStockItems),

              stockValue: Number(form.stockValue),

              active,

              updated: "Today",
            });

            onClose();
          }}
        >
          {department ? "Update Department" : "Save Department"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}