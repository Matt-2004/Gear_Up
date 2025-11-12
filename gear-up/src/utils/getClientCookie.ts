"use client";

export function getAccessToken() {
  if (typeof document === "undefined") return { undefined }; // safety check

  const token = document.cookie;

  const cookies = extractToken(token);
  return cookies.access_token;
}

export function getResetToken() {
  if (typeof document === "undefined") return { undefined }; // safety check

  const token = document.cookie;

  const cookies = extractToken(token);
  return cookies.rest_token;
}

export function extractToken(token: string) {
  const cookies = Object.fromEntries(
    token.split("; ").map((c) => c.split("="))
  );
  return cookies;
}
