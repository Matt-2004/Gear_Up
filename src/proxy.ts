import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_URL } from "./app/shared/utils/config";
import { getDecryptedFullUserData } from "./app/shared/utils/AuthUtils/cookieHelper";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/password",
  "/auth/email",
  "/car/search",
  "/post/discover",
  "/verify",
  "/reset-password",
  "/unauthorized",
  "/forbidden",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const normalized = route.startsWith("/") ? route : `/${route}`;
    return pathname === normalized || pathname.startsWith(`${normalized}/`);
  });
}

function isAdminRoute(pathname: string): boolean {
  return (
    pathname === "/profile/admin" || pathname.startsWith("/profile/admin/")
  );
}

function isDealerRoute(pathname: string): boolean {
  return (
    pathname === "/profile/dealer" || pathname.startsWith("/profile/dealer/")
  );
}

function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("user_data");
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

type RefreshResult =
  | { success: true; accessToken: string; response: NextResponse }
  | { success: false };

async function refreshAccessToken(
  refreshToken: string,
  isProduction: boolean,
): Promise<RefreshResult> {
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshToken),
    });

    if (!res.ok) {
      console.error(`Token refresh failed: ${res.status} ${res.statusText}`);
      return { success: false };
    }

    const data = await res.json();
    const tokenData = data?.data ?? data;
    const nextAccessToken: string | undefined = tokenData?.accessToken;
    const nextRefreshToken: string | undefined = tokenData?.refreshToken;

    if (!nextAccessToken || !nextRefreshToken) {
      console.error("Token refresh response missing tokens");
      return { success: false };
    }

    const response = NextResponse.next();
    response.cookies.set("access_token", nextAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 60 * 5, // 5 minutes
    });
    response.cookies.set("refresh_token", nextRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, accessToken: nextAccessToken, response };
  } catch (error) {
    console.error(
      "Error during token refresh:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return { success: false };
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function proxy(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const { pathname } = req.nextUrl;

  let accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const userDataCookie = req.cookies.get("user_data")?.value;

  // 1. Always allow the admin login page through
  if (
    pathname === "/profile/admin/login" ||
    pathname.startsWith("/profile/admin/login")
  ) {
    return NextResponse.next();
  }

  // 2. No tokens + protected route → redirect home
  const hasTokens = accessToken || refreshToken;
  if (!hasTokens && !isPublicRoute(pathname)) {
    console.log(`Access denied to ${pathname} — no authentication tokens`);
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("user_data");
    return response;
  }

  // 3. Refresh token exists but access token is missing → attempt refresh
  let refreshedResponse: NextResponse | null = null;

  if (refreshToken && !accessToken) {
    const result = await refreshAccessToken(refreshToken, isProduction);

    if (!result.success) {
      const response = NextResponse.redirect(new URL("/", req.url));
      clearAuthCookies(response);
      return response;
    }

    accessToken = result.accessToken;
    refreshedResponse = result.response;
  }

  // 4. Role-based access control
  const userData = await getDecryptedFullUserData(userDataCookie);

  // Dealer: restrict to dealer profile (messages are an exception)
  if (userData?.role === "Dealer" && !isDealerRoute(pathname)) {
    if (pathname.startsWith("/messages")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/profile/dealer?tab=car-management", req.url),
    );
  }

  // Admin: restrict to admin area
  if (userData?.role === "Admin" && !isAdminRoute(pathname)) {
    return NextResponse.redirect(
      new URL("/profile/admin?tab=dashboard", req.url),
    );
  }

  // Protect admin routes from non-admins
  if (isAdminRoute(pathname)) {
    if (!userDataCookie || !userData || userData.role !== "Admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return refreshedResponse ?? NextResponse.next();
}

// ---------------------------------------------------------------------------
// Route matcher
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    // Exclude static assets, API routes, and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
