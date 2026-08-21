import { NextResponse, type NextRequest } from "next/server";

import { ROLES, type Role } from "@/config/roles";
import {
  SESSION_PRESENCE_COOKIE,
  SESSION_ROLE_HINT_COOKIE,
} from "@/lib/auth";
import {
  canRoleAccessPath,
  getDefaultRouteForRole,
  isPublicPath,
} from "@/lib/auth/routes";

/**
 * Edge route guard (#149).
 *
 * WHAT THIS IS NOT
 * ----------------
 * This is **not** authorization, and nothing here should ever be described as
 * such. The access token lives in memory in the browser and is deliberately
 * never written to a cookie (see src/lib/api.ts) — a clinician's token in a
 * cookie is a stolen record set. So the edge cannot verify identity: all it can
 * read is `hd_session`, a non-secret presence flag, and `hd_role_hint`, a
 * non-secret string the client wrote.
 *
 * Both are trivially forgeable. Forging them gets you a rendered page shell and
 * nothing else: every API request carries a Bearer token the backend verifies
 * against Keycloak, and `require_roles(...)` decides what data is returned.
 * That is the real boundary and it has not moved.
 *
 * WHAT IT IS FOR
 * --------------
 * Stopping the wrong screen from being sent at all. Before this, a signed-out
 * user typing /admin/users received the page, the bundle ran, and the client
 * guard in MainLayout redirected after hydration — so the admin shell was
 * visibly on screen for a moment. Redirecting at the edge means the flash never
 * happens, and it removes the class of bug where a screen forgets to mount
 * inside MainLayout and is therefore guarded by nothing.
 */

const KNOWN_ROLES = new Set<string>(Object.values(ROLES));

function roleHintFrom(request: NextRequest): Role | null {
  const raw = request.cookies.get(SESSION_ROLE_HINT_COOKIE)?.value;
  // Validated against the realm role list rather than trusted: this string
  // came from a cookie, and an unknown value must deny rather than index into
  // the prefix map with something nobody defined.
  return raw && KNOWN_ROLES.has(raw) ? (raw as Role) : null;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

  const hasSession = request.cookies.get(SESSION_PRESENCE_COOKIE)?.value === "1";

  if (!hasSession) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    // Preserve where they were going, so a bookmarked deep link survives the
    // round trip through Keycloak instead of dumping them on a landing page.
    login.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  const role = roleHintFrom(request);

  // No usable hint: let it through to the client, where AuthProvider has the
  // real token and MainLayout makes the final call. Redirecting on a missing
  // hint would bounce a legitimately signed-in user whose cookie has expired
  // slightly ahead of their session.
  if (!role) return NextResponse.next();

  if (!canRoleAccessPath(role, pathname)) {
    const home = request.nextUrl.clone();
    home.pathname = getDefaultRouteForRole(role);
    home.search = "";
    return NextResponse.redirect(home);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, the API proxy, and anything with a file
     * extension. silent-check-sso.html in particular must never be redirected —
     * Keycloak loads it in a hidden iframe and a 307 to /login would break
     * silent SSO for every already-authenticated user.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
