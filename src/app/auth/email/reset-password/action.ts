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
	formData: FormData,
){
	const email = (formData.get("email") as string) 

	try {
		await fetch(
			`${API_URL}/api/v1/auth/send-password-reset-token?email=${encodeURIComponent(email)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
	} catch (error) {
		console.error("Error during sending password reset email: ");
		throw new Error("Failed to send password reset email");
	}
}

export type Submit = typeof submit
