import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// GET /api/cars?pageNum=1
// GET /api/cars/search?...
export async function GET(req: NextRequest) {
  const search = req.nextUrl.search;

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/cars${search}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 502 },
    );
  }
}

// POST /api/cars  — add a car (FormData)
export async function POST(req: NextRequest) {
  const token = await getToken();

  try {
    const formData = await req.formData();
    const res = await fetch(`${BACKEND_API_URL}/api/v1/cars`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to add car" }, { status: 502 });
  }
}
