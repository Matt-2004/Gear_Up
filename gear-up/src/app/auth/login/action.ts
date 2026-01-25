"use server"

import { authCookieIntegration } from "@/lib/authCookieIntegration"

export type ToastType = "success" | "error" | "info"

export type LoginActionState = {
	ok: boolean
	toastType: ToastType
	message: string | null
	redirectTo?: string | null
}

const initialMessageFromResponse = (ok: boolean) =>
	ok ? "Login successful" : "Invalid credentials"

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
		const res = await authCookieIntegration(`/api/auth/login`, {
			usernameOrEmail,
			password,
		})

		if (!res) {
			return {
				ok: false,
				toastType: "error",
				message: "Login failed",
				redirectTo: null,
			}
		}

		let payload: any = null
		try {
			payload = await res.json()
		} catch {
			payload = null
		}

		const ok = res.ok
		const message =
			(payload && typeof payload === "object" && "message" in payload
				? String(payload.message)
				: initialMessageFromResponse(ok)) || initialMessageFromResponse(ok)

		return {
			ok,
			toastType: ok ? "success" : "error",
			message,
			redirectTo: ok ? "/" : null,
		}
	} catch (error) {
		return {
			ok: false,
			toastType: "error",
			message: "Unexpected error during login",
			redirectTo: null,
		}
	}
}
