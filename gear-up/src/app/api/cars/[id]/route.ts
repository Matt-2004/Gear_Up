import { deleteFetch, getFetch, putFetch } from "@/utils/API/AxiosClient"
import { NextRequest, NextResponse } from "next/server"

// GET - Fetch car details by ID
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params
		const data = await getFetch(`/cars/${id}`)
		return NextResponse.json(data)
	} catch (error) {
		console.error("Error fetching car:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		)
	}
}

// PUT/PATCH - Update car details
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params
		const body = await req.json()
		const data = await putFetch(`/cars/${id}`, body)
		return NextResponse.json(data)
	} catch (error) {
		console.error("Error updating car:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		)
	}
}

// DELETE - Remove car
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params
		await deleteFetch(`/cars/${id}`)
		return NextResponse.json({ message: "Car deleted successfully" })
	} catch (error) {
		console.error("Error deleting car:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		)
	}
}
