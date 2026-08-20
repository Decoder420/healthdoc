/**
 * Canonical client is src/lib/api.ts (Next src/ layout).
 * Re-export so older imports and fe_check.mjs keep resolving here.
 *
 * Access token is held in memory only — never localStorage/sessionStorage.
 */
export {
  api,
  ApiError,
  setAccessToken,
  getAccessToken,
  formatMoney,
  formatDateTime,
  newIdempotencyKey,
} from "../src/lib/api";
export type { Envelope, ApiOptions } from "../src/lib/api";
