import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/comments/[commentId]/children
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const { commentId } = await params;
  const token = await getToken();

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/api/v1/comments/${commentId}/childrens`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 502 },
    );
  }
}
