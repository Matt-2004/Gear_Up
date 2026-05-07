import { NextRequest, NextResponse } from "next/server";
import { getDecryptedFullUserData } from "./app/shared/utils/AuthUtils/cookieHelper";

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/password",
  "/auth/email",
  "/car/search",
  "/verify",
  "/reset-password",
  "/car",
];

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

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("access_token")?.value;
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

  // Protect dealer routes from non-dealers
  if (isDealerRoute(pathname)) {
    if (!userDataCookie || !userData || userData.role !== "Dealer") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  // Protect admin routes from non-admins
  if (isAdminRoute(pathname)) {
    if (!userDataCookie || !userData || userData.role !== "Admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude static assets, API routes, and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
