import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// PATCH /api/notifications/[id]/read
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getToken();

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/api/v1/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 502 },
    );
  }
}

// DELETE /api/notifications/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getToken();

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 502 },
    );
  }
}
