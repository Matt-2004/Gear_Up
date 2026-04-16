import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/notifications?cursor=...&limit=...
export async function GET(req: NextRequest) {
  const token = await getToken();
  const search = req.nextUrl.search;

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/api/v1/notifications${search}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 502 },
    );
  }
}

// DELETE /api/notifications  — delete all
export async function DELETE(_req: NextRequest) {
  const token = await getToken();

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/notifications`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 502 },
    );
  }
}
