import { DEFAULT_API_URL } from "@/lib/config"

export async function submit(formData: FormData) {
	"use server"
	const email = formData.get("email") as string

	await fetch(
		`${DEFAULT_API_URL}/api/v1/auth/resend-verification-email?email=${email}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		},
	)
}

export type Submit = typeof submit
