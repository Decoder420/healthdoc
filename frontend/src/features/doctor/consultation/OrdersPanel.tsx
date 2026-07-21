"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Button } from "@/components/ui/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { toast } from "@/components/ui/toast";
import {
  mockLabTests,
  mockRadiologyTests,
  mockProcedures,
  type CatalogItem,
  type DraftOrder,
  type OrderType,
  type OrderPriority,
} from "./mockEncounterData";

const CATALOG_BY_TYPE: Record<OrderType, CatalogItem[]> = {
  lab: mockLabTests,
  radiology: mockRadiologyTests,
  procedure: mockProcedures,
};

const PRIORITY_BADGE: Record<OrderPriority, "default" | "secondary" | "destructive"> = {
  routine: "default",
  urgent: "secondary",
  stat: "destructive",
};

export interface OrdersPanelProps {
  encounterId: string;
  onOrdersChange?: (orders: DraftOrder[]) => void;
}

export function OrdersPanel({ encounterId, onOrdersChange }: OrdersPanelProps) {
  const [open, setOpen] = React.useState(false);
  const [orderType, setOrderType] = React.useState<OrderType>("lab");
  const [item, setItem] = React.useState<CatalogItem | null>(null);
  const [priority, setPriority] = React.useState<OrderPriority>("routine");
  const [notes, setNotes] = React.useState("");
  const [orders, setOrders] = React.useState<DraftOrder[]>([]);

  const resetForm = () => {
    setItem(null);
    setPriority("routine");
    setNotes("");
  };

  const handleAddOrder = () => {
    if (!item) return;

    // TODO: replace with POST /orders once ready:
    //   { encounter_id, order_type, priority } + type-specific detail row
    const newOrder: DraftOrder = {
      id: crypto.randomUUID(),
      encounter_id: encounterId,
      order_type: orderType,
      item_name: item.name,
      priority,
      notes: notes || undefined,
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    onOrdersChange?.(updated);
    toast.success(`${orderType[0].toUpperCase()}${orderType.slice(1)} order added`);
    resetForm();
    setOpen(false);
  };

  const removeOrder = (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    onOrdersChange?.(updated);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: "16px", display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Orders</Typography>
        <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
          + Add Order
        </Button>
      </Stack>

      {orders.length === 0 ? (
        <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
          No orders added yet for this encounter.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {orders.map((o) => (
            <Box
              key={o.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{o.item_name}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", textTransform: "capitalize" }}>
                  {o.order_type}
                  {o.notes ? ` · ${o.notes}` : ""}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Badge variant={PRIORITY_BADGE[o.priority]}>{o.priority}</Badge>
                <IconButton size="small" onClick={() => removeOrder(o.id)} aria-label="Remove order">
                  ×
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title="Add Order"
        actions={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddOrder} disabled={!item}>
              Add Order
            </Button>
          </>
        }
      >
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={(_, val) => {
              if (val) {
                setOrderType(val);
                setItem(null);
              }
            }}
            size="small"
            fullWidth
          >
            <ToggleButton value="lab">Lab</ToggleButton>
            <ToggleButton value="radiology">Radiology</ToggleButton>
            <ToggleButton value="procedure">Procedure</ToggleButton>
          </ToggleButtonGroup>

          <SearchAutocomplete<CatalogItem>
            label={`Search ${orderType} test/procedure`}
            options={CATALOG_BY_TYPE[orderType]}
            value={item}
            onChange={setItem}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
          />

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as OrderPriority)}
            size="small"
          >
            <MenuItem value="routine">Routine</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="stat">STAT</MenuItem>
          </TextField>

          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
          />
        </Stack>
      </Modal>
    </Paper>
  );
}