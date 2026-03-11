import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Read the access_token cookie server-side */
export async function getToken(): Promise<string> {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

/** Safely parse JSON — returns null for 204 / empty bodies */
export async function safeJson(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Standard 502 error response */
export function gatewayError(message = "Upstream request failed") {
  return NextResponse.json({ error: message }, { status: 502 });
}
