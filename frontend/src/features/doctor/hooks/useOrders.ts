"use client";

import { useCallback, useState } from "react";

import { toast } from "@/components/ui/toast";
import { createOrder } from "../api";
import type { ActiveEncounter, CatalogItem, DraftOrder, OrderPriority, OrderType } from "../types";

export function useOrders(encounter: ActiveEncounter) {
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  const [adding, setAdding] = useState(false);

  const addOrder = useCallback(
    async (draft: { order_type: OrderType; item: CatalogItem; priority: OrderPriority }) => {
      setAdding(true);
      try {
        await createOrder({
          encounter_id: encounter.encounter_id,
          patient_id: encounter.patient_id,
          order_type: draft.order_type,
          catalog_item_id: draft.item.id,
          item_name: draft.item.name,
          priority: draft.priority,
        });
        setOrders((prev) => [
          ...prev,
          {
            tempId: crypto.randomUUID(),
            order_type: draft.order_type,
            catalog_item_id: draft.item.id,
            item_name: draft.item.name,
            priority: draft.priority,
          },
        ]);
        toast.success(`${draft.item.name} ordered`);
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to place order");
        return false;
      } finally {
        setAdding(false);
      }
    },
    [encounter],
  );

  const removeOrder = useCallback(
    (tempId: string) => setOrders((prev) => prev.filter((o) => o.tempId !== tempId)),
    [],
  );

  return { orders, adding, addOrder, removeOrder };
}
