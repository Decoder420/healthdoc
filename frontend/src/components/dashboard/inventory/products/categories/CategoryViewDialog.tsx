"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import type { Category } from "@/features/inventory/types/category";

interface Props {
  open: boolean;

  category: Category | null;

  onClose: () => void;
}

export default function CategoryViewDialog({
  open,
  category,
  onClose,
}: Props) {
  if (!category) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Category Details
      </DialogTitle>

      <DialogContent dividers>

        <div className="space-y-5">

          <Info
            label="Category Code"
            value={category.code}
          />

          <Info
            label="Category Name"
            value={category.name}
          />

          <Info
            label="Description"
            value={
              category.description ||
              "-"
            }
          />

          <Divider />

          <div className="grid grid-cols-2 gap-5">

            <Info
              label="Items"
              value={`${category.itemCount}`}
            />

            <Info
              label="Status"
              value={
                category.isActive
                  ? "Active"
                  : "Inactive"
              }
            />

          </div>

          <Info
            label="Created At"
            value={category.createdAt}
          />

        </div>

      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}