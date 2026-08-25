import type { TargetModule } from "./components/DischargeForm/DischargeForm.types";
import { MODULE_LABELS } from "./components/DischargeForm/constants";

/** Static discharge notification preview (no per-admission preview endpoint). */
export const DEFAULT_NOTIFICATION_PREVIEW = (
  Object.keys(MODULE_LABELS) as TargetModule[]
).map((mod) => ({ target_module: mod, status: "queued" as const }));
