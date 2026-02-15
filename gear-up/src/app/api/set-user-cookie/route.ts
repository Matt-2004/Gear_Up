import { encrypt } from "@/utils/encryption"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const { userId, role } = await req.json()

		console.log("Received cookie request - userId:", userId, "role:", role)

		if (!userId || !role) {
			console.error("Missing userId or role:", { userId, role })
			return NextResponse.json(
				{ success: false, message: "User ID and role are required" },
				{ status: 400 },
			)
		}

		// Encrypt the user data before setting it in the cookie
		console.log("Encrypting user data...")
		const encryptedData = await encrypt({ userId: userId.toString(), role })
		console.log("Encrypted data:", encryptedData.substring(0, 20) + "...")

		const response = NextResponse.json({ success: true })

		response.cookies.set("user_id", encryptedData, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		})

		console.log("Cookie set successfully")
		return response
	} catch (error) {
		console.error("Error setting user_id cookie:", error)
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 },
		)
	}
}
