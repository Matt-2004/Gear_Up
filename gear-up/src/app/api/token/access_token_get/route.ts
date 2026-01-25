import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
	const access_token = (await cookies()).get("access_token")?.value || ""
	console.log("Access Token in access_token_get route:", access_token)
	return NextResponse.json({ access_token })
}
