import { API_URL } from "@/lib/config";
import { LoginDTO } from "@/types/auth.types";
import { NextRequest, NextResponse } from "next/server";

type BackendErrorPayload = {
  message?: string;
  error?: string;
  errors?: string[];
};

const parseBackendBody = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload) return fallback;

  if (typeof payload === "string") return payload;

  if (typeof payload === "object") {
    const parsed = payload as BackendErrorPayload;

    if (typeof parsed.message === "string" && parsed.message.trim()) {
      return parsed.message;
    }

    if (typeof parsed.error === "string" && parsed.error.trim()) {
      return parsed.error;
    }

    if (Array.isArray(parsed.errors) && parsed.errors.length) {
      return parsed.errors.join(", ");
    }
  }

  return fallback;
};

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as LoginDTO;

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await parseBackendBody(response);

    if (!response.ok) {
      const message = getErrorMessage(body, "Login failed");
      return NextResponse.json({ message }, { status: response.status });
    }

    const nextResponse = NextResponse.json(body ?? {}, {
      status: response.status,
      statusText: response.statusText,
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Internal Server Error";

    return NextResponse.json({ message }, { status: 500 });
  }
}
