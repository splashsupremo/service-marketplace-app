import { NextRequest, NextResponse } from "next/server";
import { verifyAdminJwt } from "@/lib/auth/jwt";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for admin token cookie
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the JWT
  const payload = await verifyAdminJwt(token);

  if (!payload) {
    // Token is invalid or expired — clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  // Valid session — attach admin info to headers for use in server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-id", payload.adminId);
  requestHeaders.set("x-admin-email", payload.email);
  requestHeaders.set("x-admin-name", payload.fullName);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Run middleware on all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};