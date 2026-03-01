import { IUser } from "@/app/types/user.types"
import { API_URL } from "@/lib/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	const access_token = req.cookies.get("access_token")?.value

	if (!access_token) {
		return NextResponse.json({ data: null, message: "Access token not found" })
	}

	try {
		const res = await fetch(`${API_URL}/api/v1/users/me`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ data: null, message: "Failed to fetch user profile" },
				{ status: res.status },
			)
		}

		const response = (await res.json()) as IUser

		return NextResponse.json(response)
	} catch (error) {
		return NextResponse.json(
			{ data: null, message: "Internal server error" },
			{ status: 500 },
		)
	}
}
