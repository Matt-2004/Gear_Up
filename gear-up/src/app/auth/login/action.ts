// app/actions/auth.ts
import { DEFAULT_API_URL } from "@/lib/config"

export async function submit(formData: FormData) {
	"use server"
	const usernameOrEmail = formData.get("usernameOrEmail") as string
	const password = formData.get("password") as string
	console.log("server action is working....")
	console.log(usernameOrEmail, password)

	await fetch(`${DEFAULT_API_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			usernameOrEmail,
			password,
		}),
	})
}

export type Submit = typeof submit
