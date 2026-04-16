import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// POST /api/users/kyc  — KYC registration (FormData)
export async function POST(req: NextRequest) {
  const token = await getToken();

  try {
    const formData = await req.formData();
    const res = await fetch(`${BACKEND_API_URL}/api/v1/users/kyc`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit KYC" },
      { status: 502 },
    );
  }
}
