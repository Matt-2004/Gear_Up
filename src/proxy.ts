import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_URL } from "./app/shared/utils/config";
import { getDecryptedFullUserData } from "./app/shared/utils/AuthUtils/cookieHelper";

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
] as const;

const ADMIN_LOGIN_ROUTE = "/profile/admin/login";
const ADMIN_ROOT_ROUTE = "/profile/admin";
const DEALER_ROOT_ROUTE = "/profile/dealer";
const DEALER_DEFAULT_ROUTE = "/profile/dealer?tab=car-management";
const ADMIN_DEFAULT_ROUTE = "/profile/admin?tab=dashboard";

type RefreshTokenResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
};

function isRouteMatch(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => isRouteMatch(pathname, route));
}

function isAdminRoute(pathname: string) {
  return isRouteMatch(pathname, ADMIN_ROOT_ROUTE);
}

function isAdminLoginRoute(pathname: string) {
  return isRouteMatch(pathname, ADMIN_LOGIN_ROUTE);
}

function isDealerRoute(pathname: string) {
  return isRouteMatch(pathname, DEALER_ROOT_ROUTE);
}

function isMessagesRoute(pathname: string) {
  return isRouteMatch(pathname, "/messages");
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("user_data");

  return response;
}

function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.url));
}

function redirectAndClearAuth(path: string, req: NextRequest) {
  const response = redirectTo(path, req);
  return clearAuthCookies(response);
}

async function refreshAuthTokens(refreshToken: string) {
  const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshToken),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res
    .json()
    .catch(() => null)) as RefreshTokenResponse | null;

  const tokenData = data?.data ?? data;

  const accessToken = tokenData?.accessToken;
  const nextRefreshToken = tokenData?.refreshToken;

  if (!accessToken || !nextRefreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  };
}

function setAuthCookies(
  response: NextResponse,
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
) {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 5,
  });

  response.cookies.set("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const userDataCookie = req.cookies.get("user_data")?.value;

  const isPublic = isPublicRoute(pathname);
  const isAdminPath = isAdminRoute(pathname);
  const hasAccessToken = Boolean(accessToken);
  const hasRefreshToken = Boolean(refreshToken);
  const hasAnyToken = hasAccessToken || hasRefreshToken;

  /**
   * Admin login should be accessible without auth.
   */
  if (isAdminLoginRoute(pathname)) {
    return NextResponse.next();
  }

  /**
   * Public routes should be accessible.
   * Example: "/", "/car/search", "/post/discover"
   */
  if (isPublic) {
    return NextResponse.next();
  }

  /**
   * Protected route without any token.
   */
  if (!hasAnyToken) {
    return redirectAndClearAuth("/", req);
  }

  /**
   * Refresh access token if refresh token exists but access token is missing.
   */
  let responseWithRefreshCookies: NextResponse | null = null;

  if (!hasAccessToken && refreshToken) {
    const refreshedTokens = await refreshAuthTokens(refreshToken);

    if (!refreshedTokens) {
      return redirectAndClearAuth("/", req);
    }

    responseWithRefreshCookies = setAuthCookies(
      NextResponse.next(),
      refreshedTokens,
    );
  }

  /**
   * Role checks depend on user_data.
   * If user_data is missing, do not allow protected role routes.
   */
  const userData = await getDecryptedFullUserData(userDataCookie);

  if (!userData) {
    return redirectAndClearAuth("/", req);
  }

  /**
   * Protect admin pages.
   */
  if (isAdminPath) {
    if (userData.role !== "Admin") {
      return redirectTo("/forbidden", req);
    }

    return responseWithRefreshCookies ?? NextResponse.next();
  }

  /**
   * Dealer users should stay inside dealer area,
   * but allow messages.
   */
  if (userData.role === "Dealer") {
    const canAccessDealerRoute = isDealerRoute(pathname);
    const canAccessMessages = isMessagesRoute(pathname);

    if (!canAccessDealerRoute && !canAccessMessages) {
      return redirectTo(DEALER_DEFAULT_ROUTE, req);
    }

    return responseWithRefreshCookies ?? NextResponse.next();
  }

  /**
   * Admin users should stay inside admin area for protected pages.
   */
  if (userData.role === "Admin") {
    return redirectTo(ADMIN_DEFAULT_ROUTE, req);
  }

  return responseWithRefreshCookies ?? NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match pages, but skip:
     * - API routes
     * - Next internals
     * - static files with extensions
     */
    "/((?!api|_next|.*\\..*).*)",
  ],
};
