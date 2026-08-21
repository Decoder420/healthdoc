import type { Role } from "@/config/roles";

const AUTH_TOKEN_KEY = "auth-token";
const AUTH_ROLE_KEY = "auth-role";
const AUTH_USER_KEY = "auth-user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;


  departmentId?: string;
  departmentName?: string;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );

  return match?.[1]
    ? decodeURIComponent(match[1])
    : null;
}

function setCookie(name: string, value: string) {
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie =
    `${name}=; path=/; max-age=0`;
}

export function getAuthToken(): string | null {
  return getCookie(AUTH_TOKEN_KEY);
}

export function getAuthRole(): Role | null {
  const role = getCookie(AUTH_ROLE_KEY);

  return role as Role | null;
}

export function getAuthUser(): AuthUser | null {
  const raw = getCookie(AUTH_USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthSession(
  user: AuthUser,
  token: string,
) {
  setCookie(AUTH_TOKEN_KEY, token);
  setCookie(AUTH_ROLE_KEY, user.role);
  setCookie(
    AUTH_USER_KEY,
    JSON.stringify(user),
  );
}

export function setAuthToken(token: string) {
  setCookie(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(AUTH_ROLE_KEY);
  deleteCookie(AUTH_USER_KEY);
}