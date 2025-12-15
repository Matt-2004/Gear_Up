import { DEFAULT_API_URL } from "@/lib/config"
import { cookies } from "next/headers"

export async function submit(formData: FormData) {
	"use server"
	const newPassword = formData.get("newPassword") as string
	const confirmedPassword = formData.get("confirmedPassword") as string
	const reset_token = (await cookies()).get("reset_token")?.value

	await fetch(
		`${DEFAULT_API_URL}/api/v1/auth/reset-password?token=${reset_token}`,
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
}

export type Submit = typeof submit
