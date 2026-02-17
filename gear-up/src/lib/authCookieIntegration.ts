"use server"

import { IAdminLogin } from "@/app/types/admin.types"
import { ILogin, IRegister } from "@/app/types/auth.types"
import { authResponse } from "@/app/types/data.types"
import { cookies } from "next/dist/server/request/cookies"
import { DEFAULT_API_URL } from "./config"

export async function authCookieIntegration(
	url: string,
	payload: ILogin | IRegister | IAdminLogin,
) {
	const cookieStore = await cookies()
	// url & payload
	try {
		const res = await fetch(`${DEFAULT_API_URL}${url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
		const response = (await res.json()) as authResponse

		// cookie integration
		if (response?.data?.accessToken && response?.data?.refreshToken) {
			cookieStore.set("access_token", response.data.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 5, // 5 minutes
			})
			cookieStore.set("refresh_token", response.data.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			})
		}

		// Return both status and parsed response
		return { ok: res.ok, status: res.status, data: response }
	} catch (error: any) {
		console.error("Auth cookie integration error:", error)
		return { ok: false, status: error.status || 500, data: null }
	}
}
