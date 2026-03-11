import { API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/messages/conversations/with/[otherUserId]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ otherUserId: string }> },
) {
  const { otherUserId } = await params;
  const token = await getToken();

  try {
    const res = await fetch(
      `${API_URL}/api/v1/messages/conversations/with/${otherUserId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 502 },
    );
  }
}
