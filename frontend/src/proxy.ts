import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLES } from "@/config/roles";
import type { Role } from "@/config/roles";
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
];

function withCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");
  // Reflect any origin so cookies/auth still work over LAN IPs
  response.headers.set("Access-Control-Allow-Origin", origin || "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    request.headers.get("access-control-request-headers") ||
      "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  response.headers.append("Vary", "Origin");
  return response;
}

export function proxy(request: NextRequest) {
  // Allow browser preflight from any device/IP
  if (request.method === "OPTIONS") {
    return withCors(request, new NextResponse(null, { status: 204 }));
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withCors(request, NextResponse.redirect(loginUrl));
  }

  if (token && AUTH_ROUTES.includes(pathname)) {
    const role = request.cookies.get("auth-role")?.value as Role | undefined;
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
