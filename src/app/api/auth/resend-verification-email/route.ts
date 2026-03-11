import { API_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const res = await fetch(
    `${API_URL}/api/v1/auth/resend-verification-email?email=${email}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
