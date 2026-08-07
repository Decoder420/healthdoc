"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import { X } from "lucide-react";

import type { WarehouseStock } from "@/features/inventory/types/warehouseStock";

interface Props {
  open: boolean;
  stock: WarehouseStock | null;
  onClose: () => void;
}

export default function StockListViewDialog({
  open,
  stock,
  onClose,
}: Props) {
  if (!stock) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Details
            </h2>

            <p className="text-sm text-gray-500">
              {stock.itemName}
            </p>
          </div>

          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="grid grid-cols-2 gap-4 py-3">
          <Detail label="Item Name" value={stock.itemName} />
          <Detail label="Category" value={stock.category} />

          <Detail label="Brand" value={stock.brand || "-"}/>

          <Detail
            label="Supplier"
            value={stock.supplierName || "-"}
          />

          <Detail
            label="Batch Number"
            value={stock.batchNumber}
          />

          <Detail
            label="Expiry Date"
            value={stock.expiryDate || "-"}
          />

          <Detail
            label="Quantity"
            value={`${stock.quantity} ${stock.unit}`}
          />

          <Detail
            label="Available"
            value={`${stock.availableQuantity} ${stock.unit}`}
          />

          <Detail
            label="Warehouse"
            value={stock.warehouseName}
          />

          <Detail
            label="Received Date"
            value={stock.receivedDate}
          />

          <Detail
            label="GRN"
            value={stock.grnNumber || "-"}
          />

          <Detail
            label="Status"
            value={stock.status}
          />
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
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}