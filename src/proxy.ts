import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_URL } from "./app/shared/utils/config";
import { getDecryptedFullUserData } from "./app/shared/utils/AuthUtils/cookieHelper";

// Define public routes that don't require authentication
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

// Middleware to handle authentication and route protection
// if refresh token exists, but no access token, try to refresh token
// if refresh token is invalid, clear cookies and redirect to home
// roles-based access control for admin routes --> only allow users with Admin role to access /profile/admin routes, else redirect to "Unauthorized" page or home
// if user is a dealer, redirect to dealer profile page when accessing any protected route except dealer profile page
// if no tokens and trying to access protected route, redirect to home

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
    return (
      pathname === normalizedRoute || pathname.startsWith(`${normalizedRoute}/`)
    );
  });
}

// Helper function to fetch and cache user data

export async function proxy(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  let accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const user_data_cookie = req.cookies.get("user_data")?.value;
  const currentPath = req.nextUrl.pathname;
  const isAdminPath =
    currentPath === "/profile/admin" ||
    currentPath.startsWith("/profile/admin/");

  // Check if tokens exist
  const hasTokens = accessToken || refreshToken;

  // Allow access to admin login page without authentication
  if (
    currentPath === "/profile/admin/login" ||
    currentPath.startsWith("/profile/admin/login")
  ) {
    return NextResponse.next();
  }

  // If no tokens and trying to access protected route, redirect to home
  if (!hasTokens && !isPublicRoute(currentPath)) {
    console.log(
      `Access denied to ${currentPath} - No authentication tokens found`,
    );
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("user_data");
    return response;
  }

  let refreshedResponse: NextResponse | null = null;

  // If refresh token exists but no access token, attempt to refresh first
  // so subsequent role checks (especially admin routes) run with updated auth.
  if (refreshToken && !accessToken) {
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refreshToken),
      });

      if (!res.ok) {
        console.error(
          `Failed to refresh token: ${res.status} ${res.statusText}`,
        );

        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.delete("refresh_token");
        response.cookies.delete("access_token");
        response.cookies.delete("user_data");

        return response;
      }

      const data = await res.json();
      const tokenData = data?.data ?? data;
      const nextAccessToken = tokenData?.accessToken;
      const nextRefreshToken = tokenData?.refreshToken;

      if (!nextAccessToken || !nextRefreshToken) {
        console.error("Refresh response missing tokens");
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.delete("refresh_token");
        response.cookies.delete("access_token");
        response.cookies.delete("user_data");
        return response;
      }

      accessToken = nextAccessToken;
      refreshedResponse = NextResponse.next();
      refreshedResponse.cookies.set("access_token", nextAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: 60 * 5,
      });
      refreshedResponse.cookies.set("refresh_token", nextRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch (error) {
      console.error(
        "Error fetching refresh token:",
        error instanceof Error ? error.message : "Unknown error",
      );
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("refresh_token");
      response.cookies.delete("access_token");
      response.cookies.delete("user_data");
      return response;
    }
  }

  const userData = await getDecryptedFullUserData(user_data_cookie);

  // redirect dealer routes - if user is a dealer, redirect to dealer profile page when accessing any protected route except dealer profile page
  if (
    userData?.role === "Dealer" &&
    currentPath !== "/profile/dealer" &&
    !currentPath.startsWith("/profile/dealer/")
  ) {
    if (currentPath.startsWith("/messages")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/profile/dealer?tab=car-management", req.url),
    );
  }

  // Redirect admin routes - only allow users with Admin role to access /profile/admin routes, else redirect to "Unauthorized" page or home
  if (
    userData?.role === "Admin" &&
    !currentPath.startsWith("/profile/admin") &&
    currentPath !== "/profile/admin"
  ) {
    return NextResponse.redirect(
      new URL("/profile/admin?tab=dashboard", req.url),
    );
  }

  // Protect admin routes
  if (isAdminPath) {
    if (!user_data_cookie) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (userData && userData?.role === "Admin") {
      return refreshedResponse ?? NextResponse.next();
    }

    if (!userData || userData.role !== "Admin") {
      // Redirect to unauthorized page if user is not an admin
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return refreshedResponse ?? NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, API routes, and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
