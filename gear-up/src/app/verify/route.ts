import { API_URL } from "@/lib/config"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const token = searchParams.get("token")
	console.log("Token received in route:", token)

	if (!token) {
		return new Response(JSON.stringify({ message: "Token is required" }), {
			status: 400,
		})
	}

	// Call your backend API to verify the token
	try {
		const response = await fetch(
			`${API_URL}/api/v1/auth/verify-email?token=${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(token),
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			return new Response(JSON.stringify({ message: errorData }), {
				status: response.status,
			})
		}

		const data = await response.json()

		return new Response(
			JSON.stringify({
				message: "Email verified successfully",
				data,
				redirect: "http://localhost:3000/",
			}),
			{ status: 200 },
		)
	} catch (error) {
		return new Response(JSON.stringify({ message: error }), {
			status: 500,
		})
	}
}
