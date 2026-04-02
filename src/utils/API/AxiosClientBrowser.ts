function resolveUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (typeof window !== "undefined") return path;
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
    headers: getBrowserAuthHeader(),
  });
  return handleResponse(res);
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
  return handleResponse(res);
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
  return handleResponse(res);
}

export async function apiPatch(url: string, data?: unknown) {
  const authHeader = getBrowserAuthHeader();
  const res = await fetch(resolveUrl(url), {
    method: "PATCH",
    credentials: "include",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null,
  });
  return handleResponse(res);
}

export async function apiDelete(url: string) {
  const res = await fetch(resolveUrl(url), {
    method: "DELETE",
    credentials: "include",
    headers: getBrowserAuthHeader(),
  });
  return handleResponse(res);
}
