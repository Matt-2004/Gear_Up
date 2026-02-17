import { decrypt } from "@/utils/encryption"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const { encryptedData } = await req.json()

		if (!encryptedData) {
			return NextResponse.json(
				{ data: null, message: "No encrypted data provided" },
				{ status: 400 },
			)
		}

		const decryptedData = await decrypt(encryptedData)

		return NextResponse.json({ data: decryptedData })
	} catch (error) {
		console.error("Decryption error:", error)
		return NextResponse.json(
			{ data: null, message: "Failed to decrypt user data" },
			{ status: 500 },
		)
	}
}
