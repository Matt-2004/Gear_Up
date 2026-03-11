import { API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/reviews/dealers/[dealerId]/summary
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ dealerId: string }> },
) {
  const { dealerId } = await params;
  const token = await getToken();

  try {
    const res = await fetch(
      `${API_URL}/api/v1/reviews/dealers/${dealerId}/summary`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dealer review summary" },
      { status: 502 },
    );
  }
}
