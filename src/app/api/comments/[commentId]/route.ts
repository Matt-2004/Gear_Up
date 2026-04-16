import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// PUT /api/comments/[commentId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const { commentId } = await params;
  const token = await getToken();

  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_API_URL}/api/v1/comments/${commentId}`, {
      method: "PUT",
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
      { error: "Failed to update comment" },
      { status: 502 },
    );
  }
}

// DELETE /api/comments/[commentId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const { commentId } = await params;
  const token = await getToken();

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 502 },
    );
  }
}
