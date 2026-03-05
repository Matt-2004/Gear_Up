import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const GET = async () => {
	const access_token = (await cookies()).get("access_token")?.value || ""
	return NextResponse.json({ access_token })
}
