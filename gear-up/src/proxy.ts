import { NextRequest, NextResponse } from "next/server"
import { API_URL } from "./lib/config"
import { getDecryptedUserData } from "./utils/cookieHelper"

export async function proxy(req: NextRequest) {
	const access_token = req.cookies.get("access_token")?.value
	const refresh_token = req.cookies.get("refresh_token")?.value
	const user_id_cookie = req.cookies.get("user_id")?.value
	console.log("user_id_cookie:", user_id_cookie)

	// Check if user is a dealer and redirect to dealer profile if not already there
	if (user_id_cookie) {
		const userData = await getDecryptedUserData(user_id_cookie)
		console.log("Decrypted user data:", userData)
		if (userData && userData.role === "Dealer") {
			const currentPath = req.nextUrl.pathname
			const dealerProfilePath = "/profile/dealer"

			// Only redirect if not already on dealer profile page
			if (!currentPath.startsWith(dealerProfilePath)) {
				return NextResponse.redirect(new URL(dealerProfilePath, req.url))
			}
		}
	}

	if (access_token) {
		return NextResponse.next()
	}

	if (!refresh_token) {
		return NextResponse.next()
	}

	if (refresh_token && !access_token) {
		// Remove the refresh token cookie & redirect to home
		NextResponse.next().cookies.delete("refresh_token")
		NextResponse.redirect(new URL("/", req.url))
	}

	try {
		const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(refresh_token),
		})

		if (!res.ok) {
			console.error(`Failed to refresh token: ${res.status} ${res.statusText}`)

			// Clear invalid refresh token and redirect to home
			const response = NextResponse.redirect(new URL("/", req.url))
			response.cookies.delete("refresh_token")
			response.cookies.delete("access_token")

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

		// Clear tokens and redirect to home on network/fetch error
		const response = NextResponse.redirect(new URL("/", req.url))
		response.cookies.delete("refresh_token")
		response.cookies.delete("access_token")

		return response
	}
}

export const config = {
	matcher: [
		// Exclude API routes, static files, image optimizations, and .png files
		"/((?!api|_next/static|_next/image|.*\\.png$).*)",
	],
}
