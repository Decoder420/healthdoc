import { NextResponse, type NextRequest } from "next/server";

import { ROLES, type Role } from "@/config/roles";
import { SESSION_PRESENCE_COOKIE, SESSION_ROLE_HINT_COOKIE } from "@/lib/auth";
import {
  canRoleAccessPath,
  getDefaultRouteForRole,
  isPublicPath,
} from "@/lib/auth/routes";

/**
 * Edge route guard (#149). Called `proxy` because Next 16 renamed
 * `middleware.ts` to `proxy.ts`.
 *
 * WHAT THIS IS NOT
 * ----------------
 * Not authorization, and it should never be described as such. The access
 * token lives in memory in the browser and is deliberately never written to a
 * cookie (src/lib/api.ts) — a clinician's token in a cookie is a stolen record
 * set. So all the edge can read is `hd_session`, a non-secret presence flag,
 * and `hd_role_hint`, a non-secret string the client wrote. Both are trivially
 * forgeable, and forging them yields a rendered page shell and nothing else:
 * every API request carries a Bearer token the backend verifies against
 * Keycloak, and `require_roles(...)` decides what data is returned.
 *
 * WHAT IT IS FOR
 * --------------
 * Not sending the wrong screen in the first place. The presence check was
 * already here; the role check is new — before it, any signed-in user could
 * request /admin/users and receive the admin shell, which then rendered until
 * MainLayout redirected after hydration. It also covers screens that forget to
 * mount inside MainLayout and would otherwise be guarded by nothing.
 */

const KNOWN_ROLES = new Set<string>(Object.values(ROLES));

/**
 * Paths that need no session.
 *
 * `/` is here because the root page decides where to send you once the client
 * knows the real role. `/silent-check-sso.html` must never be redirected —
 * Keycloak loads it in a hidden iframe and a 307 would break silent SSO for
 * every already-authenticated user. The rest come from `isPublicPath`, shared
 * with MainLayout so the edge and the client cannot disagree — notably
 * `/queue-display`, the waiting-room wall screen, which is unauthenticated by
 * design on both sides of the stack.
 */
function needsNoSession(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/silent-check-sso.html" ||
    isPublicPath(pathname)
  );
}

function roleHintFrom(request: NextRequest): Role | null {
  const raw = request.cookies.get(SESSION_ROLE_HINT_COOKIE)?.value;
  // Validated against the realm role list, not trusted: this came from a
  // cookie, and an unknown value must deny rather than be looked up.
  return raw && KNOWN_ROLES.has(raw) ? (raw as Role) : null;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (needsNoSession(pathname)) return NextResponse.next();

  if (request.cookies.get(SESSION_PRESENCE_COOKIE)?.value !== "1") {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  const role = roleHintFrom(request);

  // No usable hint: let it through to the client, where AuthProvider holds the
  // real token and MainLayout makes the final call. Redirecting on a missing
  // hint would bounce a legitimately signed-in user whose hint cookie expired
  // slightly ahead of their Keycloak session.
  if (!role) return NextResponse.next();

  if (!canRoleAccessPath(role, pathname)) {
    return NextResponse.redirect(
      new URL(getDefaultRouteForRole(role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Next owns every /_next/* resource (including the Next 16 HMR websocket).
  // Applying a session redirect there breaks hydration and leaves login inert.
  matcher: ["/((?!api|auth|_next|favicon.ico).*)"],
};
