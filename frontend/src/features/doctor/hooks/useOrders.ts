"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/ui/toast";
import { listOrders, placeOrder } from "../api";
import type { ActiveEncounter, DraftOrder, PlacedOrder } from "../types";

export function useOrders(encounter: ActiveEncounter) {
  const [placed, setPlaced] = useState<PlacedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void listOrders(encounter.id)
      .then((rows) => {
        if (!cancelled) setPlaced(rows);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Failed to load orders");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [encounter.id]);

  const addOrder = useCallback(
    async (draft: Omit<DraftOrder, "tempId">, idempotencyKey: string) => {
      setAdding(true);
      try {
        // Two calls: the order header, then its clinical detail row.
        const result = await placeOrder(
          draft,
          {
            encounter_id: encounter.id,
            patient_id: encounter.patient_id,
          },
          idempotencyKey,
        );
        setPlaced((prev) => [...prev, result]);
        if (result.detail_status === "failed") {
          toast.error(
            `${result.order_number} was created, but its department item failed. Do not reorder; contact support.`,
          );
        } else {
          toast.success(
            `${result.item_label} ordered${
              result.accession_number ? ` · ${result.accession_number}` : ""
            }`,
          );
        }
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

  return { placed, loading, adding, addOrder };
}
