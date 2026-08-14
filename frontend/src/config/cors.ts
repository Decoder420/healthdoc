/**
 * Browser origins allowed to make credentialed requests to this app.
 * Never reflect the request Origin — that enables CSRF-style cross-site reads.
 *
 * Add LAN/dev hosts via NEXT_PUBLIC_ALLOWED_ORIGINS (comma-separated).
 */
const DEFAULT_ALLOWED_ORIGINS = [
  "https://localhost",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "app://healthdoc",
];

export function getAllowedOrigins(): string[] {
  const extra = (process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...extra])];
}

export function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}
