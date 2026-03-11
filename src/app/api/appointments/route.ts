import { API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// POST /api/appointments  — create appointment
export async function POST(req: NextRequest) {
  const token = await getToken();

  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/api/v1/appointments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 502 },
    );
  }
}
