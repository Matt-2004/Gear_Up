import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/posts/me?cursor=...
export async function GET(req: NextRequest) {
  const token = await getToken();
  const search = req.nextUrl.search;

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/posts/me${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch your posts" },
      { status: 502 },
    );
  }
}
