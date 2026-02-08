import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware — runs on every request matching the `config.matcher`.
 * Handles authentication, RBAC, and request enrichment.
 */

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/blog",
  "/contact",
  "/courses",
  "/faqs",
  "/privacy-policy",
  "/terms",
  "/testimonials",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-2fa",
];

const ADMIN_ROUTES = ["/admin"];
const _DASHBOARD_ROUTES = ["/dashboard", "/settings", "/activity"];

/** Check if the path matches any public route (exact or prefix) */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets, Next.js internals, and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/site.webmanifest"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  // 2. Allow public routes
  if (isPublicRoute(pathname)) {
    // If user is already logged in and trying to access auth pages, redirect to dashboard
    if (accessToken && (pathname === "/login" || pathname === "/register")) {
      try {
        const secret = new TextEncoder().encode(
          process.env.ACCESS_TOKEN_SECRET,
        );
        await jwtVerify(accessToken, secret);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // Token invalid, let them through to login
      }
    }
    return NextResponse.next();
  }

  // 3. Protected routes — require valid access token
  if (!accessToken) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);

    if (!payload || !payload.id) {
      throw new Error("Invalid token payload");
    }

    const role = payload.role as string;

    // 4. RBAC checks — admin routes require ADMIN or STAFF role
    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
      if (role !== "ADMIN" && role !== "STAFF") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // 5. Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    requestHeaders.set("x-user-role", role);
    requestHeaders.set("x-user-email", (payload.email as string) || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    // Token invalid or expired — clear cookies and redirect
    const response = pathname.startsWith("/api")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("accessToken");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (images, logo)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|logo|robots.txt|site.webmanifest).*)",
  ],
};
