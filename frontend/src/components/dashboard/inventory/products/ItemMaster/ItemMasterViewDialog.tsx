
"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import { X } from "lucide-react";

import type { ItemMaster } from "@/features/inventory/types/itemMaster";

interface Props {
  open: boolean;
  item: ItemMaster | null;
  onClose: () => void;
}

export default function ItemMasterViewDialog({
  open,
  item,
  onClose,
}: Props) {
  if (!item) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Item Details
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {item.itemCode}
            </p>
          </div>

          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2">
          <Detail
            label="Item Name"
            value={item.itemName}
          />

          <Detail
            label="Item Code"
            value={item.itemCode}
          />

          <Detail
            label="Category"
            value={item.category}
          />

          <Detail
            label="Subcategory"
            value={
              item.subcategory || "-"
            }
          />

          <Detail
            label="Brand"
            value={
              item.brand || "-"
            }
          />

          <Detail
            label="Unit"
            value={item.unit}
          />

          <Detail
            label="Minimum Stock"
            value={`${item.minimumStock}`}
          />

          <Detail
            label="Reorder Level"
            value={`${item.reorderLevel}`}
          />

          <Detail
            label="Supplier"
            value={
              item.supplierName || "-"
            }
          />

          <Detail
            label="Storage Location"
            value={
              item.storageLocation || "-"
            }
          />

          <Detail
            label="Status"
            value={
              item.isActive
                ? "Active"
                : "Inactive"
            }
          />

          <Detail
            label="Created At"
            value={item.createdAt}
          />

          <div className="sm:col-span-2">
            <Detail
              label="Description"
              value={
                item.description || "-"
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

