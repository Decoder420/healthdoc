import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth guard + CORS (Next.js proxy / middleware equivalent).
 * Dev stub: allows all routes until Keycloak session is wired.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Future: redirect unauthenticated users away from /(dashboard) routes
  void request;
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
