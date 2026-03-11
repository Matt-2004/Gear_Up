import { API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// PATCH /api/appointments/[id]/[action]
// action: cancel | complete | accept | reject
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> },
) {
  const { id, action } = await params;
  const token = await getToken();

  try {
    let body: string | null = null;
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const text = await req.text();
      body = text || null;
    }

    const res = await fetch(`${API_URL}/api/v1/appointments/${id}/${action}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: `Failed to ${action} appointment` },
      { status: 502 },
    );
  }
}
