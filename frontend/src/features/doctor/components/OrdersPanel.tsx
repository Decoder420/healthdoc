"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { meridian } from "@/styles/theme";
import { ORDER_TYPE_OPTIONS } from "../constants";
import { useOrders } from "../hooks/useOrders";
import { doctorPanelSx, doctorButtonSx } from "../panelSx";
import type { ActiveEncounter, OrderPriority } from "../types";
import { OrderFormModal } from "./OrderFormModal";

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
  const { placed, loading, adding, addOrder } = useOrders(encounter);
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ ...doctorPanelSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Orders</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            Lab and radiology orders for this encounter
          </Typography>
        </Box>
        <Button variant="outlined" size="small" sx={doctorButtonSx} disabled={loading} onClick={() => setOpen(true)}>
          + Add order
        </Button>
      </Stack>

      {loading ? (
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          Loading orders…
        </Typography>
      ) : placed.length === 0 ? (
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          No orders added yet for this encounter.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {placed.map((order) => (
            <Box
              key={order.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "12px",
                border: `1px solid ${meridian.border}`,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  {order.item_label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: order.detail_status === "failed" ? meridian.danger : meridian.textSecondary,
                  }}
                >
                  {order.detail_status === "failed"
                    ? `${order.order_number} · department item failed`
                    : order.accession_number
                      ? `${order.order_number} · ${order.accession_number}`
                      : order.order_number}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Badge variant="outline">{typeLabel(order.order_type)}</Badge>
                <Badge variant={PRIORITY_BADGE[order.priority]}>{order.priority}</Badge>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <OrderFormModal open={open} busy={adding} onClose={() => setOpen(false)} onAdd={addOrder} />
    </Box>
  );
}
