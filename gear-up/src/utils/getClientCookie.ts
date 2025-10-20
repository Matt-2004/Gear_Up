"use client";

export function getClientCookies() {
  if (typeof document === "undefined") return {}; // safety check

  const token = document.cookie;
  const cookies = extractToken(token);
  return cookies;
}

export function extractToken(token: string) {
  const cookies = Object.fromEntries(
    token.split("; ").map((c) => c.split("="))
  );
}
