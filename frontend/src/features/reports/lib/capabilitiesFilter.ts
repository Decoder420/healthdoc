import type { FacilityCapabilities } from "@/features/admin/types";
import { CORE_KPI_CODES, KPI_MODULE_GATES } from "../constants";
import type { CoreKpiCode } from "../types";

/** Filter MIS tiles by mock facility capabilities (module toggles). */
export function visibleKpiCodes(
  capabilities: FacilityCapabilities | null | undefined,
): readonly CoreKpiCode[] {
  if (!capabilities) return CORE_KPI_CODES;
  return CORE_KPI_CODES.filter((code) => {
    const gate = KPI_MODULE_GATES[code];
    if (!gate) return true;
    return capabilities.modules[gate] === true;
  });
}
