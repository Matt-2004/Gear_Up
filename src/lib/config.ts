export const API_URL = process.env.NEXT_PUBLIC_API_KEY as string;

/** Base URL of this Next.js app — required for SSR fetch to /api/... routes */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:5255";

export const DEFAULT_API_URL = "http://localhost:3000";
