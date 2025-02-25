import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const isAuthPage = request.nextUrl.pathname === "/login";
  const isActivatePage = request.nextUrl.pathname === "/activate";
  const isRootPage = request.nextUrl.pathname === "/";
  const hasCodeParam = request.nextUrl.searchParams.has("code");

  // Allow access to activate page or root with code parameter without authentication
  if (isActivatePage || (isRootPage && hasCodeParam)) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/activities", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
