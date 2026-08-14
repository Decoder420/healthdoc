import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLES } from "@/config/roles";
import type { Role } from "@/config/roles";
import { isAllowedOrigin } from "@/config/cors";
import { getDefaultRouteForRole } from "@/lib/auth/routes";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

const PUBLIC_ROUTES = [
  ...AUTH_ROUTES,
  "/queue-display",
  "/patient-portal",
  "/silent-check-sso.html",
];

/** UX-only session presence — not a bearer credential. */
const SESSION_PRESENCE_COOKIE = "hd_session";
const SESSION_ROLE_HINT_COOKIE = "hd_role_hint";

function withCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");
  if (isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.append("Vary", "Origin");
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    request.headers.get("access-control-request-headers") ||
      "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const origin = request.headers.get("origin");
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    return withCors(request, new NextResponse(null, { status: 204 }));
  }

  const { pathname } = request.nextUrl;
  const hasSession =
    request.cookies.get(SESSION_PRESENCE_COOKIE)?.value === "1";
  // Legacy cookie from earlier builds — still honor for one transition so
  // existing local sessions are not instantly bounced; identity remains Keycloak.
  const legacyToken = request.cookies.get("auth-token")?.value;
  const isSignedIn = hasSession || Boolean(legacyToken);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isSignedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withCors(request, NextResponse.redirect(loginUrl));
  }

  if (isSignedIn && AUTH_ROUTES.includes(pathname)) {
    const role = (request.cookies.get(SESSION_ROLE_HINT_COOKIE)?.value ||
      request.cookies.get("auth-role")?.value) as Role | undefined;
    const destination =
      role && Object.values(ROLES).includes(role)
        ? getDefaultRouteForRole(role)
        : "/dashboard";
    return withCors(
      request,
      NextResponse.redirect(new URL(destination, request.url)),
    );
  }

  return withCors(request, NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\..*).*)",
  ],
};
