import type { AuthUser } from "./types";
import type { Role } from "@/config/roles";

const AUTH_TOKEN_COOKIE = "auth-token";
const AUTH_ROLE_COOKIE = "auth-role";
const AUTH_USER_COOKIE = "auth-user";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

export function setAuthSession(user: AuthUser, token: string) {
  setCookie(AUTH_TOKEN_COOKIE, token);
  setCookie(AUTH_ROLE_COOKIE, user.role);
  setCookie(AUTH_USER_COOKIE, JSON.stringify(user));
}

export function clearAuthToken() {
  clearCookie(AUTH_TOKEN_COOKIE);
  clearCookie(AUTH_ROLE_COOKIE);
  clearCookie(AUTH_USER_COOKIE);
}

export function getAuthToken(): string | null {
  return getCookie(AUTH_TOKEN_COOKIE);
}

export function getAuthUserFromCookie(): AuthUser | null {
  const raw = getCookie(AUTH_USER_COOKIE);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.email || !parsed?.role) return null;
    return {
      id: parsed.id,
      name: parsed.name ?? "",
      email: parsed.email,
      role: parsed.role as Role,
    };
  } catch {
    return null;
  }
}
