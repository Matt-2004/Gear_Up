"use server"

import { API_URL } from "@/lib/config"
import { cookies } from "next/headers"

export async function submit(
	formData: FormData,
) {
	const newPassword = (formData.get("newPassword") as string)
	const confirmePassword = (formData.get("confirmePassword") as string) 
	const reset_token = (await cookies()).get("reset_token")?.value

	if(!reset_token) {
			console.log("No reset token found in cookies");
			throw new Error("No reset token found");
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
					confirmePassword,
				}),
			},
		)

		if (!res.ok) {
			throw new Error(`Failed to reset password: ${res.status} ${res.statusText}`)
		}
	}
	catch (error) {
		console.error("Error during password reset: ", error);
		throw error;
	}
}
export type Submit = typeof submit
