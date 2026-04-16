import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// PATCH /api/notifications/read-all
export async function PATCH(_req: NextRequest) {
  const token = await getToken();

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/api/v1/notifications/read-all`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 502 },
    );
  }
}
