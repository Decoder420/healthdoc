import type {
  FacilityCapabilities,
  FacilityModule,
  ModuleCode,
  UpdateFacilityModuleInput,
} from "../types";
import {
  getFacilityModules,
  isoNow,
  setFacilityModules,
} from "@/lib/mock/admin_data";
import { FACILITY_ID, MODULE_CODES } from "../constants";

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export async function listFacilityModules(
  facility_id: string = FACILITY_ID,
): Promise<FacilityModule[]> {
  return delay(getFacilityModules().filter((m) => m.facility_id === facility_id));
}

/** Mock GET /facility/capabilities from facility_modules seed. */
export async function getFacilityCapabilities(
  facility_id: string = FACILITY_ID,
): Promise<FacilityCapabilities> {
  const rows = getFacilityModules().filter((m) => m.facility_id === facility_id);
  const modules = {} as Record<ModuleCode, boolean>;
  const config = {} as Record<ModuleCode, Record<string, unknown>>;
  for (const code of MODULE_CODES) {
    const row = rows.find((m) => m.module_code === code);
    modules[code] = row?.is_enabled ?? false;
    config[code] = row?.config ?? {};
  }
  return delay({ modules, config });
}

export async function updateFacilityModule(
  id: string,
  patch: UpdateFacilityModuleInput,
): Promise<FacilityModule> {
  const store = getFacilityModules();
  const idx = store.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Facility module not found");
  const next: FacilityModule = {
    ...store[idx],
    is_enabled: patch.is_enabled,
    disabled_reason: patch.is_enabled
      ? null
      : (patch.disabled_reason ?? store[idx].disabled_reason),
    config: patch.config ?? store[idx].config,
    updated_at: isoNow(),
  };
  store[idx] = next;
  setFacilityModules(store);
  return delay(next);
}
