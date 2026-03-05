import { NextRequest, NextResponse } from "next/server"
import { IUser } from "./types/user.types"
import { API_URL } from "./lib/config"
import { getDecryptedFullUserData } from "./utils/cookieHelper"
import { encrypt } from "./utils/encryption"

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
]

// Middleware to handle authentication and route protection
// if refresh token exists, but no access token, try to refresh token
// if refresh token is invalid, clear cookies and redirect to home
// roles-based access control for admin routes --> only allow users with Admin role to access /profile/admin routes, else redirect to "Unauthorized" page or home
// if user is a dealer, redirect to dealer profile page when accessing any protected route except dealer profile page
// if no tokens and trying to access protected route, redirect to home

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
	// Check if pathname exactly matches or starts with any public route
	return PUBLIC_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	)
}

// Helper function to fetch and cache user data

export async function proxy(req: NextRequest) {
	const access_token = req.cookies.get("access_token")?.value
	const refresh_token = req.cookies.get("refresh_token")?.value
	const user_data_cookie = req.cookies.get("user_data")?.value
	const currentPath = req.nextUrl.pathname

	// Check if tokens exist
	const hasTokens = access_token || refresh_token

	// Allow access to admin login page without authentication
	if (
		currentPath === "/profile/admin/login" ||
		currentPath.startsWith("/profile/admin/login/")
	) {
		return NextResponse.next()
	}

	// If no tokens and trying to access protected route, redirect to home
	if (!hasTokens && !isPublicRoute(currentPath)) {
		console.log(
			`Access denied to ${currentPath} - No authentication tokens found`,
		)
		const response = NextResponse.redirect(new URL("/", req.url))
		response.cookies.delete("user_data")
		return response
	}

	const userData = await getDecryptedFullUserData(user_data_cookie)

	// redirect dealer routes - if user is a dealer, redirect to dealer profile page when accessing any protected route except dealer profile page
	if (
		userData?.role === "Dealer" &&
		currentPath !== "/profile/dealer" &&
		!currentPath.startsWith("/profile/dealer/")
	) {
		if (currentPath.startsWith("/messages")) {
			return NextResponse.next()
		}
		return NextResponse.redirect(
			new URL("/profile/dealer?tab=dashboard", req.url),
		)
	}

	// Redirect admin routes - only allow users with Admin role to access /profile/admin routes, else redirect to "Unauthorized" page or home
	if (
		userData?.role === "Admin" &&
		!currentPath.startsWith("/profile/admin") &&
		currentPath !== "/profile/admin"
	) {
		return NextResponse.redirect(
			new URL("/profile/admin?tab=dashboard", req.url),
		)
	}

	// Protect admin routes
	if (currentPath.startsWith("/profile/admin")) {
		if (!user_data_cookie) {
			return NextResponse.redirect(new URL("/", req.url))
		}

		if (userData && userData?.role === "Admin") {
			return NextResponse.next()
		}

		if (!userData || userData.role !== "Admin") {
			// Redirect to unauthorized page if user is not an admin
			return NextResponse.redirect(new URL("/unauthorized", req.url))
		}
	}

	if (!refresh_token) {
		return NextResponse.next()
	}

	// If refresh token exists but no access token, attempt to refresh
	if (refresh_token && !access_token) {
		try {
			const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(refresh_token),
			})

			if (!res.ok) {
				console.error(
					`Failed to refresh token: ${res.status} ${res.statusText}`,
				)

				// Clear invalid refresh token and redirect to home
				const response = NextResponse.redirect(new URL("/", req.url))
				response.cookies.delete("refresh_token")
				response.cookies.delete("access_token")
				response.cookies.delete("user_data")
				response.cookies.delete("user_id")

				return response
			}

			const data = await res.json()

			const { accessToken, refreshToken } = data.data
			const response = NextResponse.next()

			response.cookies.set("access_token", accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 5, // 5 minutes
			})
			response.cookies.set("refresh_token", refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			})

			return response
		} catch (error) {
			console.error(
				"Error fetching refresh token:",
				error instanceof Error ? error.message : "Unknown error",
			)
		}

		if (!access_token && !refresh_token) {
			const response = NextResponse.next()
			response.cookies.delete("user_data")
			if (req.nextUrl.pathname !== "/") {
				return NextResponse.redirect(new URL("/", req.url))
			}
		}
	}
}

export const config = {
	matcher: [
		// Match all routes except static files, API routes, and Next.js internals
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
	],
}
