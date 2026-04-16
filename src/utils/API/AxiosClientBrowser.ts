import { MainResponse } from "@/app/shared/types.ts/main-response";

function resolveUrl(path: string): string {
  const base = process.env.NEXT_DEFAULT_API_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

function getBrowserAuthHeader(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = sessionStorage.getItem("session_access_token") ?? "";
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiFetch(url: string) {
  const res = await fetch(resolveUrl(url), {
    method: "GET",
    credentials: "include",
    headers: getBrowserAuthHeader(),
  });

  const respnose = await res.json();
  return respnose;
}

export async function apiPost(url: string, data: unknown) {
  const isFormData = data instanceof FormData;
  const authHeader = getBrowserAuthHeader();
  const res = await fetch(resolveUrl(url), {
    method: "POST",
    credentials: "include",
    headers: isFormData
      ? authHeader
      : { ...authHeader, "Content-Type": "application/json" },
    body: isFormData ? data : data !== null ? JSON.stringify(data) : null,
  });
  const respnose = await res.json();
  return respnose;
}

export async function apiPut(url: string, data: unknown) {
  const isFormData = data instanceof FormData;
  const authHeader = getBrowserAuthHeader();
  const res = await fetch(resolveUrl(url), {
    method: "PUT",
    credentials: "include",
    headers: isFormData
      ? authHeader
      : { ...authHeader, "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
  const respnose = await res.json();
  return respnose;
}

export async function apiPatch(url: string, data?: unknown) {
  const authHeader = getBrowserAuthHeader();
  const res = await fetch(resolveUrl(url), {
    method: "PATCH",
    credentials: "include",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null,
  });
  const respnose = await res.json();
  return respnose;
}

export async function apiDelete(url: string) {
  const res = await fetch(resolveUrl(url), {
    method: "DELETE",
    credentials: "include",
    headers: getBrowserAuthHeader(),
  });
  const respnose = await res.json();
  return respnose;
}
