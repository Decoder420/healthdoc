import Keycloak from "keycloak-js";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";
import { setAccessToken } from "@/lib/api";

/**
 * Keycloak OIDC client (realm healthdoc · public client healthdoc-frontend · PKCE).
 * Access token stays in memory via lib/api — never cookies / localStorage.
 */

const url =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL ??
  process.env.NEXT_PUBLIC_KEYCLOAK_PUBLIC_URL ??
  "https://localhost/auth";
const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "healthdoc";
const clientId =
  process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "healthdoc-frontend";

let keycloak: Keycloak | null = null;
let initPromise: Promise<boolean> | null = null;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  sub: string;
  roles: string[];
};

function getKeycloak(): Keycloak {
  if (!keycloak) {
    keycloak = new Keycloak({ url, realm, clientId });
  }
  return keycloak;
}

/** Map Keycloak realm/client roles onto app Role values. */
export function mapKeycloakRolesToAppRole(roles: string[]): Role {
  const normalized = roles.map((r) => r.toLowerCase());
  if (normalized.includes("admin") || normalized.includes("realm-admin")) {
    return ROLES.ADMIN;
  }
  if (normalized.includes("doctor")) return ROLES.DOCTOR;
  if (normalized.includes("nurse")) return ROLES.NURSE;
  if (normalized.includes("pharmacist")) return ROLES.PHARMACIST;
  if (
    normalized.includes("lab_technician") ||
    normalized.includes("lab-technician") ||
    normalized.includes("lab")
  ) {
    return ROLES.LAB_TECHNICIAN;
  }
  if (normalized.includes("accountant") || normalized.includes("billing")) {
    return ROLES.ACCOUNTANT;
  }
  if (normalized.includes("receptionist") || normalized.includes("registration")) {
    return ROLES.RECEPTIONIST;
  }
  return ROLES.RECEPTIONIST;
}

export function sessionUserFromKeycloak(kc: Keycloak): SessionUser | null {
  if (!kc.authenticated || !kc.tokenParsed) return null;
  const parsed = kc.tokenParsed as {
    sub?: string;
    preferred_username?: string;
    name?: string;
    email?: string;
    realm_access?: { roles?: string[] };
    resource_access?: Record<string, { roles?: string[] }>;
  };
  const realmRoles = parsed.realm_access?.roles ?? [];
  const clientRoles = parsed.resource_access?.[clientId]?.roles ?? [];
  const roles = [...realmRoles, ...clientRoles];
  const role = mapKeycloakRolesToAppRole(roles);
  const sub = parsed.sub ?? "";
  return {
    id: sub,
    sub,
    name: parsed.name || parsed.preferred_username || "User",
    email: parsed.email || "",
    role,
    roles,
  };
}

function syncAccessToken(kc: Keycloak) {
  setAccessToken(kc.token ?? null);
}

/**
 * Initialize Keycloak once (silent SSO). Returns whether the user is authenticated.
 */
export async function initKeycloak(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!initPromise) {
    const kc = getKeycloak();
    initPromise = kc
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          typeof window !== "undefined"
            ? `${window.location.origin}/silent-check-sso.html`
            : undefined,
      })
      .then((authenticated) => {
        if (authenticated) {
          syncAccessToken(kc);
          kc.onTokenExpired = () => {
            void kc
              .updateToken(30)
              .then((refreshed) => {
                if (refreshed) syncAccessToken(kc);
              })
              .catch(() => {
                setAccessToken(null);
              });
          };
        }
        return authenticated;
      })
      .catch((err) => {
        console.error("[keycloak] init failed", err);
        initPromise = null;
        return false;
      });
  }
  return initPromise;
}

export async function loginWithKeycloak(redirectUri?: string): Promise<void> {
  const kc = getKeycloak();
  await initKeycloak();
  await kc.login({
    redirectUri: redirectUri ?? window.location.origin + "/dashboard",
  });
}

export async function logoutFromKeycloak(redirectUri?: string): Promise<void> {
  const kc = getKeycloak();
  setAccessToken(null);
  if (kc.authenticated) {
    await kc.logout({
      redirectUri: redirectUri ?? window.location.origin + "/login",
    });
  }
}

export function getKeycloakSessionUser(): SessionUser | null {
  if (!keycloak) return null;
  return sessionUserFromKeycloak(keycloak);
}

export function isKeycloakConfigured(): boolean {
  return Boolean(url && realm && clientId);
}
