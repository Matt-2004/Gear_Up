// /app/api/auth/refresh/route.ts
import { API_URL } from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  // Pass backend cookies to browser
  const response = NextResponse.json(data);
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
  }

  return response;
}
