"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/ui/toast";
import {
  getFacilityCapabilities,
  listFacilityModules,
  updateFacilityModule,
} from "../api";
import { FACILITY_ID } from "../constants";
import type { FacilityCapabilities, FacilityModule } from "../types";

export function useFacilityModules(facilityId: string = FACILITY_ID) {
  const [modules, setModules] = useState<FacilityModule[]>([]);
  const [capabilities, setCapabilities] = useState<FacilityCapabilities | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [mods, caps] = await Promise.all([
        listFacilityModules(facilityId),
        getFacilityCapabilities(facilityId),
      ]);
      setModules(mods);
      setCapabilities(caps);
    } finally {
      setLoading(false);
    }
  }, [facilityId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (id: string, is_enabled: boolean, disabled_reason?: string | null) => {
      setBusyId(id);
      try {
        await updateFacilityModule(id, {
          is_enabled,
          disabled_reason: is_enabled ? null : disabled_reason ?? "Disabled by admin",
        });
        await refresh();
        toast.success(is_enabled ? "Module enabled" : "Module disabled");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed");
      } finally {
        setBusyId(null);
      }
    },
    [refresh],
  );

  return { modules, capabilities, loading, busyId, toggle, refresh };
}
