
"use client";

import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import type { ItemMaster } from "@/features/inventory/types/itemMaster";

interface SupplierOption {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  suppliers: SupplierOption[];
  onClose: () => void;
  onSave: (item: ItemMaster) => void;
}

export default function AddItemDialog({
  open,
  suppliers,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    itemName: "",
    category: "",
    subcategory: "",
    brand: "",
    unit: "",
    minimumStock: "",
    reorderLevel: "",
    supplierId: "",
    storageLocation: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    field: string,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setError("");

    if (!form.itemName.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!form.unit.trim()) {
      setError("Unit is required.");
      return;
    }

    if (!form.minimumStock) {
      setError("Minimum stock is required.");
      return;
    }

    if (!form.reorderLevel) {
      setError("Reorder level is required.");
      return;
    }

    const selectedSupplier = suppliers.find(
      (supplier) =>
        supplier.id === form.supplierId
    );

    const newItem: ItemMaster = {
      id: `ITEM-${Date.now()}`,

      itemCode: `ITEM-${Date.now()}`,

      itemName: form.itemName.trim(),

      category: form.category.trim(),

      subcategory:
        form.subcategory.trim() || undefined,

      brand:
        form.brand.trim() || undefined,

      unit: form.unit.trim(),

      minimumStock:
        Number(form.minimumStock),

      reorderLevel:
        Number(form.reorderLevel),

      supplierId:
        selectedSupplier?.id,

      supplierName:
        selectedSupplier?.name,

      storageLocation:
        form.storageLocation.trim() ||
        undefined,

      description:
        form.description.trim() ||
        undefined,

      isActive: true,

      createdAt:
        new Date().toISOString(),
    };

    onSave(newItem);

    setForm({
      itemName: "",
      category: "",
      subcategory: "",
      brand: "",
      unit: "",
      minimumStock: "",
      reorderLevel: "",
      supplierId: "",
      storageLocation: "",
      description: "",
    });
  };

  const handleClose = () => {
    setError("");

    setForm({
      itemName: "",
      category: "",
      subcategory: "",
      brand: "",
      unit: "",
      minimumStock: "",
      reorderLevel: "",
      supplierId: "",
      storageLocation: "",
      description: "",
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Add Item
      </DialogTitle>

      <DialogContent dividers>
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">

          <TextField
            label="Item Name"
            value={form.itemName}
            onChange={(event) =>
              handleChange(
                "itemName",
                event.target.value
              )
            }
            fullWidth
            required
          />

          <TextField
            label="Category"
            value={form.category}
            onChange={(event) =>
              handleChange(
                "category",
                event.target.value
              )
            }
            fullWidth
            required
            placeholder="e.g. Medicine"
          />

          <TextField
            label="Subcategory"
            value={form.subcategory}
            onChange={(event) =>
              handleChange(
                "subcategory",
                event.target.value
              )
            }
            fullWidth
            placeholder="e.g. Antibiotic"
          />

          <TextField
            label="Brand"
            value={form.brand}
            onChange={(event) =>
              handleChange(
                "brand",
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Unit"
            value={form.unit}
            onChange={(event) =>
              handleChange(
                "unit",
                event.target.value
              )
            }
            fullWidth
            required
            placeholder="e.g. Tablet, Piece, Box"
          />

          <TextField
            label="Minimum Stock"
            type="number"
            value={form.minimumStock}
            onChange={(event) =>
              handleChange(
                "minimumStock",
                event.target.value
              )
            }
            fullWidth
            required
            inputProps={{
              min: 0,
            }}
          />

          <TextField
            label="Reorder Level"
            type="number"
            value={form.reorderLevel}
            onChange={(event) =>
              handleChange(
                "reorderLevel",
                event.target.value
              )
            }
            fullWidth
            required
            inputProps={{
              min: 0,
            }}
          />

          <TextField
            select
            label="Preferred Supplier"
            value={form.supplierId}
            onChange={(event) =>
              handleChange(
                "supplierId",
                event.target.value
              )
            }
            fullWidth
          >
            <MenuItem value="">
              No Supplier
            </MenuItem>

            {suppliers.map(
              (supplier) => (
                <MenuItem
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            label="Storage Location"
            value={form.storageLocation}
            onChange={(event) =>
              handleChange(
                "storageLocation",
                event.target.value
              )
            }
            fullWidth
            placeholder="e.g. Rack A-01"
          />

          <div className="md:col-span-2">
            <TextField
              label="Description"
              value={form.description}
              onChange={(event) =>
                handleChange(
                  "description",
                  event.target.value
                )
              }
              fullWidth
              multiline
              rows={3}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
        >
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}
