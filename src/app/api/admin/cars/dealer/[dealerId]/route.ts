import { API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/admin/cars/dealer/[dealerId]?pageNum=...&limit=...
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dealerId: string }> },
) {
  const { dealerId } = await params;
  const token = await getToken();
  const search = req.nextUrl.search;

  try {
    const res = await fetch(
      `${API_URL}/api/v1/admin/cars/dealer/${dealerId}${search}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dealer cars" },
      { status: 502 },
    );
  }
}
