/**
 * Lightweight fetch helpers for calling Next.js API route handlers.
 * Used by all utils/API/* files — requests go to /api/... (same origin).
 * The route handlers attach the auth token server-side.
 *
 * On the server (SSR/prerender) fetch requires an absolute URL, so we
 * resolve a base from NEXT_Backend_URL or fall back to localhost:3000.
 */

function resolveUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (typeof window !== "undefined") return path; // browser: relative is fine
  const base = process.env.NEXT_DEFAULT_API_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const json = await res.json();
      message = json?.message ?? json?.error ?? message;
    } catch {
      // non-JSON error body
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function apiFetch(url: string) {
  const res = await fetch(resolveUrl(url), {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiPost(url: string, data: unknown) {
  const isFormData = data instanceof FormData;
  const res = await fetch(resolveUrl(url), {
    method: "POST",
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? data : data !== null ? JSON.stringify(data) : null,
  });
  return handleResponse(res);
}

export async function apiPut(url: string, data: unknown) {
  const isFormData = data instanceof FormData;
  const res = await fetch(resolveUrl(url), {
    method: "PUT",
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiPatch(url: string, data?: unknown) {
  const res = await fetch(resolveUrl(url), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null,
  });
  return handleResponse(res);
}

export async function apiDelete(url: string) {
  const res = await fetch(resolveUrl(url), {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}
