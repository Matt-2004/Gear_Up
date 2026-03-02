"use server"

import { authAPI } from "@/utils/Auth/authAPI"

export async function submit(formData: FormData) {
	const username = formData.get("username") as string
	const email = formData.get("email") as string
	const firstName = formData.get("firstName") as string
	const lastName = formData.get("lastName") as string
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	try {
		await authAPI(`/api/auth/register`, {
			username,
			email,
			firstName,
			lastName,
			password,
			confirmPassword,
		})
	} catch (error) {
		console.error("fetching authCookieIntegration failed: ", error)
		throw error
	}
}

export type Submit = typeof submit
