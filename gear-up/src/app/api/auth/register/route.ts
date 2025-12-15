import { IRegister } from "@/app/types/auth.types"
import { backendFetchTokenIntegration } from "@/utils/FetchAPI"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const data = (await req.json()) as IRegister

	try {
		const response = await backendFetchTokenIntegration(
			"/api/v1/auth/register",
			"post",
			data,
		)

		return NextResponse.json({ response })
	} catch (error: any) {
		return NextResponse.json({ error }, { status: error.status })
	}
}
