import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/users/me
export async function GET(_req: NextRequest) {
  const token = await getToken();

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 502 },
    );
  }
}

// PUT /api/users/me  — update profile (FormData)
export async function PUT(req: NextRequest) {
  const token = await getToken();

  try {
    const formData = await req.formData();
    const res = await fetch(`${BACKEND_API_URL}/api/v1/users/me`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 502 },
    );
  }
}
