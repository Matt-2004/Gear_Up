import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ResetPasswordRequest } from "../types/reset-password-request";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ResetPasswordRequest;
  const token = (await cookies()).get("reset_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "No reset token found",
        data: null,
        status: 400,
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const result = await response.json().catch(() => null);

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
