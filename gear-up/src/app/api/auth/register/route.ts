import { IRegister } from "@/app/types/auth.types"
import { API_URL } from "@/lib/config"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const data = (await req.json()) as IRegister

	try {
		const response = await fetch(`${API_URL}/api/v1/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		return response
	} catch (error: any) {
		return NextResponse.json({ error }, { status: error.status })
	}
}
