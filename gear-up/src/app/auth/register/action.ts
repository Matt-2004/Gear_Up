"use server"

import { authCookieIntegration } from "@/lib/authCookieIntegration"

export type ToastType = "success" | "error" | "info"

export type RegisterActionState = {
	ok: boolean
	toastType: ToastType
	message: string | null
	redirectTo?: string | null
}

const initialMessageFromResponse = (ok: boolean) =>
	ok ? "Registration successful" : "Registration failed"

export async function submit(
	_prevState: RegisterActionState,
	formData: FormData,
): Promise<RegisterActionState> {
	const username = (formData.get("username") as string) || ""
	const email = (formData.get("email") as string) || ""
	const firstName = (formData.get("firstName") as string) || ""
	const lastName = (formData.get("lastName") as string) || ""
	const password = (formData.get("password") as string) || ""
	const confirmPassword = (formData.get("confirmPassword") as string) || ""

	if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
		return {
			ok: false,
			toastType: "error",
			message: "All fields are required",
			redirectTo: null,
		}
	}

	if (password !== confirmPassword) {
		return {
			ok: false,
			toastType: "error",
			message: "Passwords do not match",
			redirectTo: null,
		}
	}

	try {
		const res = await authCookieIntegration(`/api/auth/register`, {
			username,
			email,
			firstName,
			lastName,
			password,
			confirmPassword,
		})

		if (!res) {
			return {
				ok: false,
				toastType: "error",
				message: "Registration failed",
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
	} catch {
		return {
			ok: false,
			toastType: "error",
			message: "Unexpected error during registration",
			redirectTo: null,
		}
	}
}

export type Submit = typeof submit
