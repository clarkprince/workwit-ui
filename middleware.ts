import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const isAuthPage = request.nextUrl.pathname === "/login";
  const isActivatePage = request.nextUrl.pathname === "/activate";
  const isCreateUserPage = request.nextUrl.pathname === "/create-user";
  const isRootPage = request.nextUrl.pathname === "/";
  const hasCodeParam = request.nextUrl.searchParams.has("code");

  // Allow access to public pages without authentication
  if (isActivatePage || isCreateUserPage || (isRootPage && hasCodeParam)) {
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
