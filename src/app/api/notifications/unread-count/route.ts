import { API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/notifications/unread-count
export async function GET(_req: NextRequest) {
  const token = await getToken();

  try {
    const res = await fetch(`${API_URL}/api/v1/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 502 },
    );
  }
}
