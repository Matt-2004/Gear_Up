import { NextRequest, NextResponse } from "next/server"
import { API_URL } from "./lib/config"

export async function proxy(req: NextRequest) {
	const access_token = req.cookies.get("access_token")?.value
	const refresh_token = req.cookies.get("refresh_token")?.value

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
