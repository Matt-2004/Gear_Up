import { DEFAULT_API_URL } from "@/lib/config"

export async function submit(formData: FormData) {
	"use server"
	const username = formData.get("username") as string
	const email = formData.get("email") as string
	const firstName = formData.get("firstName") as string
	const lastName = formData.get("lastName") as string
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	console.log(username, email, firstName, lastName, password, confirmPassword)

	await fetch(`${DEFAULT_API_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			firstName,
			lastName,
			password,
			confirmPassword,
		}),
	})
}

export type Submit = typeof submit
