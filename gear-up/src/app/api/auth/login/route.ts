import { ILogin } from "@/app/types/auth.types"
import { backendFetchTokenIntegration } from "@/utils/FetchAPI"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	// integreat api function
	const data = (await req.json()) as ILogin

	try {
		const response = await backendFetchTokenIntegration(
			`/api/v1/auth/login`,
			"post",
			data,
		)

		return NextResponse.json({ response })
	} catch (error: any) {
		return NextResponse.json({ error }, { status: error.status })
	}
}
