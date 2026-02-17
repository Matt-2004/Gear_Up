"use server"

import { IUser } from "@/app/types/user.types"
import { authCookieIntegration } from "@/lib/authCookieIntegration"
import { API_URL } from "@/lib/config"
import { encrypt } from "@/utils/encryption"
import { cookies } from "next/headers"

export type ToastType = "success" | "error" | "info"

export type LoginActionState = {
	ok: boolean
	toastType: ToastType
	message: string | null
	redirectTo?: string | null
}

export async function submit(
	prevState: LoginActionState,
	formData: FormData,
): Promise<LoginActionState> {
	const usernameOrEmail = formData.get("usernameOrEmail") as string
	const password = formData.get("password") as string

	if (!usernameOrEmail || !password) {
		return {
			ok: false,
			toastType: "error",
			message: "Email/username and password are required",
			redirectTo: null,
		}
	}

	try {
		// 1. Authenticate and set access_token / refresh_token cookies
		const res = await authCookieIntegration(`/api/auth/login`, {
			usernameOrEmail,
			password,
		})

		if (!res || !res.ok) {
			return {
				ok: false,
				toastType: "error",
				message: res?.data?.message || "Login failed",
				redirectTo: null,
			}
		}

		// 2. Get the access_token that was just set
		const cookieStore = await cookies()
		const accessToken = cookieStore.get("access_token")?.value

		if (!accessToken) {
			return {
				ok: false,
				toastType: "error",
				message: "Authentication succeeded but token not found",
				redirectTo: null,
			}
		}

		// 3. Fetch full user data from backend using the access_token
		const userRes = await fetch(`${API_URL}/api/v1/users/me`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			cache: "no-store",
		})

		if (userRes.ok) {
			const userData = (await userRes.json()) as IUser

			if (userData?.data) {
				// 4. Encrypt and store user_data cookie
				const encryptedUserData = await encrypt(userData.data)
				cookieStore.set("user_data", encryptedUserData, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					maxAge: 60 * 60 * 24 * 7, // 7 days
					path: "/",
				})

				// 5. Store user_id cookie with userId and role
				if (userData.data.id && userData.data.role) {
					const encryptedUserId = await encrypt({
						userId: userData.data.id,
						role: userData.data.role,
					})

					cookieStore.set("user_id", encryptedUserId, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						maxAge: 60 * 60 * 24 * 7, // 7 days
						path: "/",
					})
				}
			}
		}

		return {
			ok: true,
			toastType: "success",
			message: res.data?.message || "Login successful",
			redirectTo: null,
		}
	} catch (error) {
		console.error("Login error:", error)
		return {
			ok: false,
			toastType: "error",
			message: "Unexpected error during login",
			redirectTo: null,
		}
	}
}
