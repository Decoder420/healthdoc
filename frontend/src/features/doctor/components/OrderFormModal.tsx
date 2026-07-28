"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Modal } from "@/components/ui/Modal";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { searchCatalog } from "../api";
import { ORDER_PRIORITY_OPTIONS, ORDER_TYPE_OPTIONS } from "../constants";
import type { CatalogItem, OrderPriority, OrderType } from "../types";

const btnSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px" } as const;

export interface OrderFormModalProps {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onAdd: (draft: {
    order_type: OrderType;
    item: CatalogItem;
    priority: OrderPriority;
  }) => Promise<boolean> | boolean;
}

export function OrderFormModal({ open, busy, onClose, onAdd }: OrderFormModalProps) {
  const [orderType, setOrderType] = React.useState<OrderType>("lab");
  const [item, setItem] = React.useState<CatalogItem | null>(null);
  const [priority, setPriority] = React.useState<OrderPriority>("routine");
  const [catalog, setCatalog] = React.useState<CatalogItem[]>([]);

  // Load the catalogue for the selected order type.
  React.useEffect(() => {
    let live = true;
    void searchCatalog(orderType, "").then((r) => live && setCatalog(r));
    return () => {
      live = false;
    };
  }, [orderType]);

  const reset = () => {
    setOrderType("lab");
    setItem(null);
    setPriority("routine");
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleAdd = async () => {
    if (!item) return;
    const ok = await onAdd({ order_type: orderType, item, priority });
    if (ok) close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add order"
      loading={busy}
      actions={
        <>
          <Button sx={btnSx} onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" sx={btnSx} onClick={handleAdd} disabled={!item}>
            Add order
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextField
          select
          label="Order type"
          value={orderType}
          onChange={(e) => {
            setOrderType(e.target.value as OrderType);
            setItem(null);
          }}
          size="small"
        >
          {ORDER_TYPE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <SearchAutocomplete<CatalogItem>
          label={`Search ${orderType} catalogue`}
          options={catalog}
          value={item}
          onChange={setItem}
          onInputChange={(q) => {
            void searchCatalog(orderType, q).then(setCatalog);
          }}
          getOptionLabel={(o) => o.name}
          getOptionSubtext={(o) => o.code}
          isOptionEqualToValue={(a, b) => a.id === b.id}
        />

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as OrderPriority)}
          size="small"
        >
          {ORDER_PRIORITY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Modal>
  );
}
