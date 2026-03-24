"use client";

const SESSION_ACCESS_TOKEN_KEY = "session_access_token";

export function setSessionAccessToken(token: string) {
  if (typeof window === "undefined") return;

  if (token) {
    sessionStorage.setItem(SESSION_ACCESS_TOKEN_KEY, token);
    return;
  }

  sessionStorage.removeItem(SESSION_ACCESS_TOKEN_KEY);
}

export function getSessionAccessToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SESSION_ACCESS_TOKEN_KEY) ?? "";
}

export function clearSessionAccessToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_ACCESS_TOKEN_KEY);
}

export async function getClientAccessToken() {
  try {
    const response = await fetch("/api/token/access_token_get", {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      const data = (await response.json()) as { access_token?: string };
      if (data?.access_token) return data.access_token;
    }
  } catch {
    // ignore and fallback to sessionStorage
  }

  return getSessionAccessToken();
}
