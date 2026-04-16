import { BACKEND_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getServerAccessToken } from "@/utils/Auth/tokenUtils";

type RefreshedTokens = {
  accessToken: string;
  refreshToken: string;
};

function authHeaders(accessToken: string): HeadersInit {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

async function tryRefreshAccessToken(): Promise<RefreshedTokens | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken || !BACKEND_API_URL) return null;

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refreshToken),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const accessToken = data?.data?.accessToken;
    const newRefreshToken = data?.data?.refreshToken;

    if (!accessToken || !newRefreshToken) return null;

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    return null;
  }
}

async function parseBackendResponse(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  return {
    isSuccess: res.ok,
    message: text || `Request failed with status ${res.status}`,
    data: null,
    status: res.status,
  };
}

// GET /api/posts?cursor=...
export async function GET(req: NextRequest) {
  let token = await getServerAccessToken();
  if (!token) {
    const authHeader = req.headers.get("authorization") ?? "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }
  const cursor = req.nextUrl.searchParams.get("cursor");

  if (!BACKEND_API_URL) {
    return NextResponse.json(
      { error: "Backend API URL is not configured" },
      { status: 500 },
    );
  }

  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  const suffix = query.toString() ? `?${query.toString()}` : "";

  try {
    let fetchPostData = await fetch(
      `${BACKEND_API_URL}/api/v1/posts${suffix}`,
      {
        headers: authHeaders(token),
        cache: "no-store",
      },
    );

    let refreshedTokens: RefreshedTokens | null = null;
    if (fetchPostData.status === 401) {
      refreshedTokens = await tryRefreshAccessToken();
      if (refreshedTokens?.accessToken) {
        token = refreshedTokens.accessToken;
        fetchPostData = await fetch(
          `${BACKEND_API_URL}/api/v1/posts${suffix}`,
          {
            headers: authHeaders(token),
            cache: "no-store",
          },
        );
      }
    }

    const PostData = await parseBackendResponse(fetchPostData);
    const response = NextResponse.json(PostData, {
      status: fetchPostData.status,
    });

    if (refreshedTokens) {
      response.cookies.set("access_token", refreshedTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 5,
      });
      response.cookies.set("refresh_token", refreshedTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (err) {
    console.error("Post Fetching Error: ", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 502 },
    );
  }
}

// POST /api/posts  — create post
export async function POST(req: NextRequest) {
  let token = await getServerAccessToken();
  if (!token) {
    const authHeader = req.headers.get("authorization") ?? "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!BACKEND_API_URL) {
    return NextResponse.json(
      { error: "Backend API URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(`${BACKEND_API_URL}/api/v1/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    let refreshedTokens: RefreshedTokens | null = null;
    if (response.status === 401) {
      refreshedTokens = await tryRefreshAccessToken();
      if (refreshedTokens?.accessToken) {
        token = refreshedTokens.accessToken;
        response = await fetch(`${BACKEND_API_URL}/api/v1/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
          cache: "no-store",
        });
      }
    }

    const data = await parseBackendResponse(response);
    const nextResponse = NextResponse.json(data, { status: response.status });

    if (refreshedTokens) {
      nextResponse.cookies.set("access_token", refreshedTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 5,
      });
      nextResponse.cookies.set("refresh_token", refreshedTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return nextResponse;
  } catch (err) {
    console.error("Post Create Error: ", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 502 },
    );
  }
}
