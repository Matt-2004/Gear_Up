import {
  AuthItem,
  AuthResponse,
  LoginDTO,
  RegisterDTO,
} from "@/types/auth.types";
import { DEFAULT_API_URL } from "@/lib/config";
import { ResponseError } from "./ResponseError";
import { IAdminLogin } from "@/types/admin.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getBackendMessage = (payload: unknown): string | null => {
  if (!payload) return null;

  if (typeof payload === "string") {
    const message = payload.trim();
    return message || null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const message = getBackendMessage(item);
      if (message) return message;
    }
    return null;
  }

  if (isRecord(payload)) {
    return (
      getBackendMessage(payload.message) ??
      getBackendMessage(payload.error) ??
      getBackendMessage(payload.data)
    );
  }

  return null;
};

const getErrorStatus = (payload: unknown, fallback: number): number => {
  if (isRecord(payload) && typeof payload.status === "number") {
    return payload.status;
  }

  return fallback;
};

export async function FetchAuthAPI(
  url: string,
  payload: LoginDTO | RegisterDTO | IAdminLogin,
): Promise<AuthResponse<AuthItem>> {
  let responseBody: unknown;
  let httpStatus = 500;

  try {
    const res = await fetch(`${DEFAULT_API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    httpStatus = res.status;

    responseBody = await res.json().catch(() => null);

    const isSuccess =
      isRecord(responseBody) &&
      typeof responseBody.isSuccess === "boolean" &&
      responseBody.isSuccess;

    if (!res.ok || !isSuccess) {
      throw new ResponseError(
        getBackendMessage(responseBody) ?? "Failed to authenticate",
        getErrorStatus(responseBody, res.status),
        {
          response: responseBody,
          data: responseBody,
          error: isRecord(responseBody) ? responseBody.error : undefined,
        },
      );
    }

    return responseBody as AuthResponse<AuthItem>;
  } catch (error) {
    if (error instanceof ResponseError) throw error;

    let message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("fetch")) {
      message = "Network error: Failed to connect to the server.";
    }

    throw new ResponseError(message, getErrorStatus(responseBody, httpStatus), {
      cause: error,
      response: responseBody,
      data: responseBody,
    });
  }
}
