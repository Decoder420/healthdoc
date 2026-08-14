/**
 * Typed fetch client for the HealthDoc API response envelope.
 *
 * SECURITY: the access token is held **in memory only**. It is deliberately NOT in
 * localStorage/sessionStorage — those are readable by any injected script.
 * The token is obtained from Keycloak (silent SSO / login) via lib/auth.
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

let accessToken: string | null = null;

/** Called by lib/auth after login / silent refresh. */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export interface Envelope<T> {
  success: boolean;
  data: T | null;
  error: { code: number; message: string } | null;
  meta: { request_id?: string };
}

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public requestId?: string,
    public payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isModuleDisabled(): boolean {
    return (
      this.code === 409 &&
      (this.payload as { code?: string })?.code === "module_disabled"
    );
  }

  get isStaleWrite(): boolean {
    return (
      this.code === 409 &&
      (this.payload as { code?: string })?.code === "stale_write"
    );
  }
}

export interface ApiOptions extends RequestInit {
  idempotencyKey?: string;
  ifMatch?: string | number;
}

export async function api<T>(path: string, init: ApiOptions = {}): Promise<T> {
  const { idempotencyKey, ifMatch, ...rest } = init;
  const method = (rest.method ?? "GET").toUpperCase();

  if (method === "POST" && !idempotencyKey) {
    console.warn(
      `[api] POST ${path} without an Idempotency-Key (schema §4A.1)`,
    );
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      ...(ifMatch !== undefined ? { "If-Match": String(ifMatch) } : {}),
      ...rest.headers,
    },
  });

  let body: Envelope<T>;
  try {
    body = (await res.json()) as Envelope<T>;
  } catch {
    throw new ApiError(res.status, "Malformed response from server");
  }

  if (!body.success || body.error) {
    throw new ApiError(
      body.error?.code ?? res.status,
      body.error?.message ?? "Request failed",
      body.meta?.request_id,
      body.error,
    );
  }
  return body.data as T;
}

export function formatMoney(amount: string, currency = "INR"): string {
  const [rupees, paise = "00"] = amount.split(".");
  const grouped = Number(rupees).toLocaleString("en-IN");
  return `${currency === "INR" ? "₹" : currency + " "}${grouped}.${paise.padEnd(2, "0")}`;
}

export function formatDateTime(iso: string, timeZone = "Asia/Kolkata"): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(iso));
}

export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}
