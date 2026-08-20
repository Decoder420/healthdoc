/**
 * Dev-only UI login (role picker) is allowed only when explicitly enabled.
 * Production / staging identity is Keycloak OIDC — never cookie tokens.
 */
export function isDevAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_MODE === "dev";
}
