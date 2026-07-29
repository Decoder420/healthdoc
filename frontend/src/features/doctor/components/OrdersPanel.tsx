"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { meridian } from "@/styles/theme";
import { ORDER_TYPE_OPTIONS } from "../constants";
import { useOrders } from "../hooks/useOrders";
import type { ActiveEncounter, OrderPriority } from "../types";
import { OrderFormModal } from "./OrderFormModal";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};
const btnSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px" } as const;

const PRIORITY_BADGE: Record<OrderPriority, BadgeVariant> = {
  routine: "secondary",
  urgent: "outline",
  stat: "destructive",
};

const typeLabel = (t: string) => ORDER_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

export interface OrdersPanelProps {
  encounter: ActiveEncounter;
}

export function OrdersPanel({ encounter }: OrdersPanelProps) {
  const { orders, adding, addOrder, removeOrder } = useOrders(encounter);
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Orders</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            Lab, radiology and procedure orders for this encounter
          </Typography>
        </Box>
        <Button variant="outlined" size="small" sx={btnSx} onClick={() => setOpen(true)}>
          + Add order
        </Button>
      </Stack>

      {orders.length === 0 ? (
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          No orders added yet for this encounter.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {orders.map((o) => (
            <Box
              key={o.tempId}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "12px",
                border: `1px solid ${meridian.border}`,
              }}
            >
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{o.item_name}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Badge variant="outline">{typeLabel(o.order_type)}</Badge>
                <Badge variant={PRIORITY_BADGE[o.priority]}>{o.priority}</Badge>
                <IconButton size="small" onClick={() => removeOrder(o.tempId)} aria-label="Remove order">
                  ×
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <OrderFormModal open={open} busy={adding} onClose={() => setOpen(false)} onAdd={addOrder} />
    </Box>
  );
}
