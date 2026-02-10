import { encrypt } from "@/utils/encryption"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const { userId } = await req.json()

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "User ID is required" },
				{ status: 400 },
			)
		}

		// Encrypt the user ID before setting it in the cookie
		const encryptedUserId = encrypt(userId.toString())

		const response = NextResponse.json({ success: true })

		response.cookies.set("user_id", encryptedUserId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		})

		return response
	} catch (error) {
		console.error("Error setting user_id cookie:", error)
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 },
		)
	}
}
