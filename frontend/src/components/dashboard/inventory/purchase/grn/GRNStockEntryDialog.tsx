"use client";

import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import {
  CalendarDays,
  MapPin,
  Package,
  Warehouse,
} from "lucide-react";

import type { GRN } from "@/features/inventory/types/grn";

interface StockLocation {
  id: string;
  name: string;
  locationType?: string;
}

interface Props {
  open: boolean;
  grn: GRN | null;
  onClose: () => void;

  onComplete: (
    grn: GRN,
    stockLocationId: string
  ) => void;
}

const stockLocations: StockLocation[] = [
  {
    id: "main-store",
    name: "Main Store",
    locationType: "central",
  },
  {
    id: "pharmacy",
    name: "Pharmacy Store",
    locationType: "pharmacy",
  },
  {
    id: "emergency",
    name: "Emergency Store",
    locationType: "emergency",
  },
  {
    id: "laboratory",
    name: "Laboratory Store",
    locationType: "lab",
  },
];

export default function GRNStockEntryDialog({
  open,
  grn,
  onClose,
  onComplete,
}: Props) {
  const [selectedLocation, setSelectedLocation] =
    useState("");

  if (!grn) return null;

  const items = grn.grnItems ?? [];

  const totalQuantity = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 0),
    0
  );

  const handleConfirm = () => {
    if (!selectedLocation) {
      return;
    }

    onComplete(
      grn,
      selectedLocation
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <DialogTitle sx={{ pb: 2 }}>
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="rounded-lg bg-primary/10 p-2">
              <Warehouse
                size={21}
                className="text-primary"
              />
            </div>

            <div>

              <Typography
                variant="h6"
                fontWeight={600}
              >
                Stock Entry
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {grn.grnNumber}
              </Typography>

            </div>

          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Verified
          </span>

        </div>
      </DialogTitle>

      <DialogContent dividers>

        {/* ====================================================
            GRN SUMMARY
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <InfoCard
            icon={<Package size={16} />}
            label="GRN Number"
            value={grn.grnNumber}
          />

          <InfoCard
            icon={<Package size={16} />}
            label="Purchase Order"
            value={grn.poNumber}
          />

          <InfoCard
            icon={<Package size={16} />}
            label="Supplier"
            value={grn.supplierName}
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Received Date"
            value={grn.receivedDate}
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            STOCK LOCATION
        ==================================================== */}

        <div className="rounded-lg border border-border p-4">

          <div className="flex items-center gap-2">

            <MapPin
              size={17}
              className="text-primary"
            />

            <p className="text-sm font-semibold">
              Stock Location
            </p>

          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Select where the received stock should be stored.
          </p>

          <div className="mt-4 max-w-md">

            <FormControl
              fullWidth
              size="small"
            >

              <InputLabel>
                Stock Location
              </InputLabel>

              <Select
                value={selectedLocation}
                label="Stock Location"
                onChange={(event) =>
                  setSelectedLocation(
                    event.target.value
                  )
                }
              >

                {stockLocations.map(
                  (location) => (
                    <MenuItem
                      key={location.id}
                      value={location.id}
                    >
                      {location.name}
                    </MenuItem>
                  )
                )}

              </Select>

            </FormControl>

          </div>

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            ITEMS
        ==================================================== */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          Stock to be Entered
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          The following verified quantities will be added to
          inventory.
        </Typography>

        <div className="overflow-hidden rounded-lg border border-border">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b bg-muted/40">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Item
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Batch Number
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Expiry Date
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Purchase Rate
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No items available for stock entry.
                    </td>

                  </tr>

                ) : (

                  items.map((item) => {

                    const quantity =
                      Number(
                        item.quantity ?? 0
                      );

                    const unitPrice =
                      Number(
                        item.unitPrice ?? 0
                      );

                    const amount =
                      Number(
                        item.amount ?? 0
                      ) ||
                      quantity * unitPrice;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >

                        <td className="px-4 py-4">

                          <p className="text-sm font-medium">
                            {item.itemName ||
                              "Unnamed Item"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.itemId ||
                              "No item ID"}
                          </p>

                        </td>

                        <td className="px-4 py-4 text-sm">
                          {item.batchNumber ||
                            "Not specified"}
                        </td>

                        <td className="px-4 py-4 text-sm">
                          {item.expiryDate ||
                            "Not specified"}
                        </td>

                        <td className="px-4 py-4 text-center text-sm font-semibold">
                          {quantity.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-4 py-4 text-right text-sm">
                          ₹
                          {unitPrice.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-medium">
                          ₹
                          {amount.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <div className="mt-5 ml-auto max-w-sm rounded-lg bg-muted/40 p-4">

          <SummaryRow
            label="Total Items"
            value={items.length}
          />

          <SummaryRow
            label="Total Quantity"
            value={totalQuantity}
          />

        </div>

        {/* ====================================================
            WARNING
        ==================================================== */}

        <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4">

          <p className="text-sm font-medium text-yellow-800">
            Stock Entry Confirmation
          </p>

          <p className="mt-1 text-sm text-yellow-700">
            Confirming this entry will add the verified
            quantities to the selected stock location.
          </p>

        </div>

      </DialogContent>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={
            !selectedLocation ||
            items.length === 0
          }
          startIcon={
            <Warehouse size={16} />
          }
        >
          Confirm Stock Entry
        </Button>

      </DialogActions>

    </Dialog>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">

      <div className="flex items-center gap-2 text-muted-foreground">

        {icon}

        <span className="text-xs">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-medium">
        {value || "Not specified"}
      </p>

    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue =
    Number(value ?? 0);

  return (
    <div className="flex justify-between py-1">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-medium">
        {safeValue.toLocaleString(
          "en-IN"
        )}
      </span>

    </div>
  );
}