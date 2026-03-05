"use server"

import { API_URL } from "@/lib/config"


export async function submit(
	
	formData: FormData,
) {
	const email = (formData.get("email") as string) || ""

	
	try {
		await fetch(
			`${API_URL}/api/v1/auth/resend-verification-email?email=${encodeURIComponent(email)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)	
	} catch(error) {
		console.error("Error during resending verification email: ");
		throw error;
	}
}

export type Submit = typeof submit
