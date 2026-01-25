"use server"

import { API_URL } from "@/lib/config"
import { cookies } from "next/headers"

export type ToastType = "success" | "error" | "info"

export type ResetPasswordActionState = {
	ok: boolean
	toastType: ToastType
	message: string | null
	redirectTo?: string | null
}

const initialMessageFromResponse = (ok: boolean) =>
	ok ? "Password changed successfully" : "Password reset failed"

export async function submit(
	_prevState: ResetPasswordActionState,
	formData: FormData,
): Promise<ResetPasswordActionState> {
	const newPassword = (formData.get("newPassword") as string) || ""
	const confirmedPassword = (formData.get("confirmedPassword") as string) || ""
	const reset_token = (await cookies()).get("reset_token")?.value

	if (!reset_token) {
		return {
			ok: false,
			toastType: "error",
			message: "Reset token missing or expired",
			redirectTo: null,
		}
	}

	if (!newPassword || !confirmedPassword) {
		return {
			ok: false,
			toastType: "error",
			message: "Both password fields are required",
			redirectTo: null,
		}
	}

	if (newPassword !== confirmedPassword) {
		return {
			ok: false,
			toastType: "error",
			message: "Passwords do not match",
			redirectTo: null,
		}
	}

	try {
		const res = await fetch(
			`${API_URL}/api/v1/auth/reset-password?token=${encodeURIComponent(reset_token)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					newPassword,
					confirmedPassword,
				}),
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
				: initialMessageFromResponse(ok)) || initialMessageFromResponse(ok)

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
			message: "Unexpected error during password reset",
			redirectTo: null,
		}
	}
}

export type Submit = typeof submit
