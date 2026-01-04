import { IAdminLogin } from "@/app/types/admin.types"
import { API_URL } from "@/lib/config"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	// integreat api function
	const data = (await req.json()) as IAdminLogin

	try {
		const response = await fetch(`${API_URL}/api/v1/admin/login`, {
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
