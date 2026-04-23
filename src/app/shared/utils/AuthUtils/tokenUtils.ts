import { cookies } from "next/headers";

export const SESSION_ACCESS_TOKEN_KEY = "session_access_token";

export async function getServerAccessToken() {
  const cookieStore = await cookies();

  // Primary token key used by the app
  const accessToken = cookieStore.get("access_token")?.value;
  if (accessToken) return accessToken;

  // Optional fallback key for session-only client storage sync
  const sessionAccessToken = cookieStore.get(SESSION_ACCESS_TOKEN_KEY)?.value;
  return sessionAccessToken ?? "";
}
