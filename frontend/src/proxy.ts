import { NextResponse, type NextRequest } from "next/server";
import { SESSION_PRESENCE_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/", "/login", "/silent-check-sso.html"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  if (request.cookies.get(SESSION_PRESENCE_COOKIE)?.value !== "1") {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  // Next owns every /_next/* resource (including the Next 16 HMR websocket).
  // Applying a session redirect there breaks hydration and leaves login inert.
  matcher: ["/((?!api|auth|_next|favicon.ico).*)"],
};
