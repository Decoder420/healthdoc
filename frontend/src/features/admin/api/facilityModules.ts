/**
 * Facility module gating. Retired from fixtures (P1.1).
 *
 * This table decides whether pharmacy, lab, radiology, OT and blood bank answer
 * at all — `require_module()` gates every endpoint in those five on it. There
 * was no read beyond a {code: bool} summary and no write path whatsoever, so
 * enabling or disabling a module for a hospital meant running SQL against
 * production. GET/PATCH /facility/modules were built alongside this change.
 */
import { api } from "@/lib/api";
import type {
  FacilityCapabilities,
  FacilityModule,
  UpdateFacilityModuleInput,
} from "../types";

/**
 * GET /facility/modules — all five toggleable modules at the caller's facility.
 *
 * Returns an entry per module code even where no row is stored, because absent
 * means enabled. Those synthesised entries carry `id: null`.
 *
 * Takes no facility argument: the token carries it.
 */
export async function listFacilityModules(): Promise<FacilityModule[]> {
  const response = await api<{ items: FacilityModule[] }>("/facility/modules");
  return response.items;
}

/** GET /facility/capabilities — the {code: boolean} summary require_module reads. */
export async function getFacilityCapabilities(): Promise<FacilityCapabilities> {
  return api<FacilityCapabilities>("/facility/capabilities");
}

/**
 * PATCH /facility/modules/{module_code}.
 *
 * Keyed on module_code, not the row id, because with default-on there may be
 * no row to name — the first time anybody disables a module, the id does not
 * exist yet. The server upserts.
 *
 * `disabled_reason` is required by the server when disabling: switching a
 * module off makes an entire department's endpoints answer 409 for the whole
 * hospital, and the next administrator needs to know it was deliberate.
 */
export async function updateFacilityModule(
  moduleCode: string,
  patch: UpdateFacilityModuleInput,
): Promise<FacilityModule> {
  return api<FacilityModule>(`/facility/modules/${moduleCode}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
