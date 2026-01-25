"use server"

import { API_URL } from "@/lib/config"

export type ToastType = "success" | "error" | "info"

export type EmailActionState = {
	ok: boolean
	toastType: ToastType
	message: string | null
	redirectTo?: string | null
}

export async function submit(
	_prevState: EmailActionState,
	formData: FormData,
): Promise<EmailActionState> {
	const email = (formData.get("email") as string) || ""

	if (!email) {
		return {
			ok: false,
			toastType: "error",
			message: "Email is required",
			redirectTo: null,
		}
	}

	try {
		const res = await fetch(
			`${API_URL}/api/v1/auth/resend-verification-email?email=${encodeURIComponent(email)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

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
				: ok
					? "Verification email sent"
					: "Failed to send verification email")

		return {
			ok,
			toastType: ok ? "success" : "error",
			message,
			redirectTo: ok ? "/auth/login" : null,
		}
	} catch {
		return {
			ok: false,
			toastType: "error",
			message: "Unexpected error",
			redirectTo: null,
		}
	}
}

export type Submit = typeof submit
