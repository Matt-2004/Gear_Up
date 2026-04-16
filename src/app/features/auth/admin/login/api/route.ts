import { BACKEND_API_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminData = await req.json();

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Server Error, please try again later",
        data: null,
        status: 500,
      },
      { status: 500 },
    );
  }
}
