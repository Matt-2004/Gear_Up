import { decrypt } from "@/utils/encryption"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
	const cookieStore = await cookies()
	if (!cookieStore.get("user_data")) {
		return NextResponse.json({ data: null, message: "User data not found" })
	}
	const userDataCookie = cookieStore.get("user_data")?.value || ""
	const userDataEncryption = await decrypt(userDataCookie)

	return NextResponse.json({
		data: userDataEncryption,
		message: "User data retrieved successfully",
	})
}
