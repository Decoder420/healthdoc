// Typed fetch client for the HealthDoc API response envelope.
// All backend responses: { success, data, error, meta } (see backend/app/common/envelope.py)

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export interface Envelope<T> {
  success: boolean;
  data: T | null;
  error: { code: number; message: string } | null;
  meta: { request_id?: string };
}

export class ApiError extends Error {
  constructor(public code: number, message: string, public requestId?: string) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("hd_token") : null;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body: Envelope<T> = await res.json();
  if (!body.success || body.error) {
    throw new ApiError(body.error?.code ?? res.status, body.error?.message ?? "Request failed", body.meta?.request_id);
  }
  return body.data as T;
}
