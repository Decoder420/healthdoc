"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Divider,
  Box,
  Typography,
} from "@mui/material";

import { X } from "lucide-react";

interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  brand: string;
  supplier: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
}

interface AddItemDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const categories = [
  "X-Ray Film",
  "Laser Film",
  "Contrast Media",
  "Consumables",
  "Machine Spare",
];

export default function AddItemDrawer({
  open,
  onClose,
  onSave,
}: AddItemDrawerProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    brand: "",
    supplier: "",
    quantity: "",
    unit: "",
    minimumStock: "",
    reorderLevel: "",
    batchNumber: "",
    expiryDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (
      !formData.itemName ||
      !formData.category ||
      !formData.quantity
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSave({
      id: Date.now(),
      itemName: formData.itemName,
      category: formData.category,
      brand: formData.brand,
      supplier: formData.supplier,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      minimumStock: Number(formData.minimumStock),
      reorderLevel: Number(formData.reorderLevel),
      batchNumber: formData.batchNumber,
      expiryDate: formData.expiryDate,
    });

    setFormData({
      itemName: "",
      category: "",
      brand: "",
      supplier: "",
      quantity: "",
      unit: "",
      minimumStock: "",
      reorderLevel: "",
      batchNumber: "",
      expiryDate: "",
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "background.paper",
          color: "text.primary",
        },
      }}
    >
      {/* Header */}

      <DialogTitle sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Add Inventory Item
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Add a new inventory item to Radiology
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Body */}

      <DialogContent
        dividers
        sx={{
          p: 3,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2.5}
        >
          <TextField
            fullWidth
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem
                key={category}
                value={category}
              >
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          />

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              type="number"
              label="Minimum Stock"
              name="minimumStock"
              value={formData.minimumStock}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              type="number"
              label="Reorder Level"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
            />
          </Box>

          <TextField
            fullWidth
            label="Batch Number"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            type="date"
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* Footer */}

      <DialogActions
        sx={{
          p: 3,
          gap: 2,
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button onClick={handleSave} variant="contained" color="primary">
          Save Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}