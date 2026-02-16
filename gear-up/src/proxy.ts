import { NextRequest, NextResponse } from "next/server";
import { IUser } from "./app/types/user.types";
import { API_URL } from "./lib/config";
import {
  getDecryptedFullUserData,
  getDecryptedUserData,
} from "./utils/cookieHelper";
import { encrypt } from "./utils/encryption";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/password",
  "/auth/email",
  "/car/search",
  "/post/discover",
  "/verify",
];

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  // Check if pathname exactly matches or starts with any public route
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

// Helper function to fetch and cache user data
async function fetchAndCacheUserData(
  access_token: string,
  response: NextResponse,
): Promise<void> {
  try {
    const userRes = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (userRes.ok) {
      const userData = (await userRes.json()) as IUser;
      if (userData?.data) {
        // Encrypt and store full user data in cookie
        const encryptedUserData = await encrypt(userData.data);
        response.cookies.set("user_data", encryptedUserData, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        console.log("User data cached successfully in proxy");
      }
    } else {
      console.error("Failed to fetch user data in proxy:", userRes.status);
    }
  } catch (error) {
    console.error("Error fetching user data in proxy:", error);
  }
}

export async function proxy(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value;
  const refresh_token = req.cookies.get("refresh_token")?.value;
  const user_id_cookie = req.cookies.get("user_id")?.value;
  const user_data_cookie = req.cookies.get("user_data")?.value;
  const currentPath = req.nextUrl.pathname;

  // Check if tokens exist
  const hasTokens = access_token || refresh_token;

  // Allow access to admin login page without authentication
  if (
    currentPath === "/profile/admin/login" ||
    currentPath.startsWith("/profile/admin/login/")
  ) {
    return NextResponse.next();
  }

  // If no tokens and trying to access protected route, redirect to home
  if (!hasTokens && !isPublicRoute(currentPath)) {
    console.log(
      `Access denied to ${currentPath} - No authentication tokens found`,
    );
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("user_id");
    response.cookies.delete("user_data");
    return response;
  }

  // Protect admin routes - check if user has Admin role
  if (currentPath.startsWith("/profile/admin")) {
    if (!user_data_cookie) {
      console.log(`Access denied to ${currentPath} - No user data available`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    const userData = await getDecryptedFullUserData(user_data_cookie);
    if (!userData || userData.role !== "Admin") {
      console.log(
        `Access denied to ${currentPath} - User role: ${userData?.role || "unknown"}`,
      );
      // Redirect non-admin users to home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Check if user is a dealer and redirect to dealer profile if not already there
  if (user_id_cookie) {
    const userData = await getDecryptedUserData(user_id_cookie);
    if (userData && userData.role === "Dealer") {
      const dealerProfilePath = "/profile/dealer";

      // Only redirect if not already on dealer profile page
      if (!currentPath.startsWith(dealerProfilePath)) {
        return NextResponse.redirect(new URL(dealerProfilePath, req.url));
      }
    }
  }

  if (access_token) {
    console.log("Access token found, proceeding to next middleware or route.");
    const response = NextResponse.next();

    // Fetch and cache user data if not already cached
    if (!user_data_cookie) {
      await fetchAndCacheUserData(access_token, response);
    }

    return response;
  }

  if (!refresh_token) {
    return NextResponse.next();
  }

  if (refresh_token && !access_token) {
    // Remove the refresh token cookie & redirect to home
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");
    response.cookies.delete("user_id");
    return response;
  }

  if (!access_token && !refresh_token) {
    console.log(
      "No access token or refresh token found. Clearing user data cookies.",
    );
    const response = NextResponse.next();
    response.cookies.delete("user_id");
    response.cookies.delete("user_data");
    if (req.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refresh_token),
    });

    if (!res.ok) {
      console.error(`Failed to refresh token: ${res.status} ${res.statusText}`);

      // Clear invalid refresh token and redirect to home
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("refresh_token");
      response.cookies.delete("access_token");
      response.cookies.delete("user_data");
      response.cookies.delete("user_id");

      return response;
    }
    console.log("Proxy is working...!");
    const data = await res.json();

    const { accessToken, refreshToken } = data.data;
    const response = NextResponse.next();

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 5, // 5 minutes
    });
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Fetch and cache user data after token refresh
    await fetchAndCacheUserData(accessToken, response);

    return response;
  } catch (error) {
    console.error(
      "Error fetching refresh token:",
      error instanceof Error ? error.message : "Unknown error",
    );

    // Clear tokens and redirect to home on network/fetch error
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("refresh_token");
    response.cookies.delete("access_token");
    response.cookies.delete("user_data");
    response.cookies.delete("user_id");

    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except static files, API routes, and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
