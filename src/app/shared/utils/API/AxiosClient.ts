"use server";

import { AdminLoginDTO } from "@/app/features/profiles/admin/types/admin.types";
import {
  LoginInputDTO,
  ResetPasswordInputDTO,
} from "@/app/features/auth/types/auth.types";
import { IAdminUpdateStatus } from "@/app/features/profiles/dealer/types/kyc.types";
import { CreateMessageDTO } from "@/app/features/messaging/types/message.types";
import { BACKEND_API_URL } from "@/app/shared/utils/config";
import { getServerAccessToken } from "@/app/shared/utils/AuthUtils/tokenUtils";
import axios, { AxiosError } from "axios";
import { SubmitVehicle } from "@/app/features/profiles/dealer/context/AddNewCarContext";
import { EmailValidationRequest } from "@/app/features/auth/emailValidation/types/email-validation-request";
import { SignUpDTO } from "@/app/features/auth/signUp/types/sign-up-dto";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { ErrorResponse } from "../errors/errorResponse";
import { CreatePostDTO } from "@/app/features/post/types/post.dto";
import { AddCommentDTO } from "@/app/features/comment/types/comment.dto";
import { IReviewSubmissionDTO } from "@/app/features/review/types/review.dto";
import { createAppointmentDTO } from "@/app/features/appointments/types/appointment.dto";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 15_000,
});

// ─── Token refresh ───────────────────────────────────────────────────

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(
  refreshToken: string,
  isProduction: boolean,
): Promise<void> {
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    console.error(`Token refresh failed: ${res.status} ${res.statusText}`);
    throw new Error("Token refresh failed");
  }

  const data = await res.json();
  const tokenData = data?.data ?? data;
  const nextAccessToken: string | undefined = tokenData?.accessToken;
  const nextRefreshToken: string | undefined = tokenData?.refreshToken;

  if (!nextAccessToken || !nextRefreshToken) {
    console.error("Token refresh response missing tokens");
    throw new Error("Token refresh failed");
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", nextAccessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 60 * 5,
  });
  cookieStore.set("refresh_token", nextRefreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 60 * 60 * 24 * 7,
  });
}

// ─── Response interceptor ────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const isProduction = process.env.NODE_ENV === "production";

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refresh_token")?.value;

      if (!refreshToken) {
        // No token to refresh — just reject. Don't try to delete cookies
        // here: this may run in a server component where cookie writes
        // are forbidden.
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Deduplicate concurrent refresh attempts
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken(refreshToken, isProduction);
        }
        await refreshPromise;
        refreshPromise = null;

        // Read the fresh token from a new cookie store snapshot
        const freshCookieStore = await cookies();
        const nextAccessToken = freshCookieStore.get("access_token")?.value;

        if (nextAccessToken) {
          originalRequest.headers = {
            ...(originalRequest.headers ?? {}),
            Authorization: `Bearer ${nextAccessToken}`,
          };
          return api.request(originalRequest);
        }
      } catch {
        refreshPromise = null;
        // Cookie deletion may fail if this interceptor runs inside a
        // server component (server components can read cookies but not
        // write them). Swallow the error — the expired tokens are harmless.
        try {
          const cleanupStore = await cookies();
          cleanupStore.delete("access_token");
          cleanupStore.delete("refresh_token");
        } catch {
          // not a server-action context — ignore
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

type ApiErrorPayload = {
  isSuccess?: boolean;
  message?: string;
  data?: null;
  status?: number;
};

// ─── Auth headers ────────────────────────────────────────────────────

async function buildAuthHeaders(
  includeJsonContentType = false,
): Promise<Record<string, string>> {
  const accessToken = await getServerAccessToken();
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

const extractErrorMessage = (
  payload: ApiErrorPayload | undefined,
  fallback: string,
): string => {
  if (payload?.message) return payload.message;
  return fallback;
};

const extractErrorStatus = (
  payload: ApiErrorPayload | undefined,
  fallback: number,
): number => {
  if (typeof payload?.status === "number") return payload.status;
  return fallback;
};

const isApiErrorPayload = (value: unknown): value is ApiErrorPayload => {
  if (!value || typeof value !== "object") return false;
  return "message" in value || "status" in value || "isSuccess" in value;
};

const normalizeError = (error: unknown, context: string): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const payload = axiosError.response?.data;

    // Network error — no response received
    if (!axiosError.response) {
      console.error(`${context}: network error (${axiosError.code ?? "unknown"})`);
      return new ErrorResponse(
        axiosError.message || "Network error — check your connection",
        0,
        null,
      );
    }

    const message = extractErrorMessage(payload, axiosError.message);
    const statusCode = extractErrorStatus(payload, axiosError.response.status);
    console.error(`${context}: ${statusCode} — ${message}`);
    return new ErrorResponse(message, statusCode, null);
  }

  if (isApiErrorPayload(error)) {
    const message = extractErrorMessage(error, "Request failed");
    const statusCode = extractErrorStatus(error, 500);
    console.error(`${context}: ${statusCode} — ${message}`);
    return new ErrorResponse(message, statusCode, null);
  }

  return new ErrorResponse(
    error instanceof Error ? error.message : "Request failed",
    500,
    null,
  );
};

function isFormData(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

async function request<TResponse>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  forceJsonContentType = false,
): Promise<TResponse> {
  try {
    // FormData → let the browser set the multipart boundary.
    // Non-FormData with data → needs Content-Type: application/json.
    const hasBody = data !== undefined && data !== null;
    const useJsonHeader =
      forceJsonContentType || (hasBody && !isFormData(data));
    const response = await api.request<TResponse>({
      method,
      url,
      data,
      headers: await buildAuthHeaders(useJsonHeader),
    });
    return response.data;
  } catch (error: unknown) {
    throw normalizeError(error, `${method.toUpperCase()} ${url}`);
  }
}

export async function getFetch<T>(url: string): Promise<T> {
  return request<T>("get", url);
}

type PostFetchAvailableType =
  | SignUpDTO
  | EmailValidationRequest
  | LoginInputDTO
  | ResetPasswordInputDTO
  | AdminLoginDTO
  | FormData
  | null
  | AddCommentDTO
  | createAppointmentDTO
  | CreatePostDTO
  | Omit<CreatePostDTO, "carId">
  | CreateMessageDTO
  | IReviewSubmissionDTO
  | Omit<IReviewSubmissionDTO, "dealerId">
  | SubmitVehicle;

export async function postFetch<T>(
  url: string,
  data: PostFetchAvailableType,
): Promise<MainResponse<T>> {
  return request<MainResponse<T>>("post", url, data);
}

export async function putFetch(
  url: string,
  data:
    | FormData
    | IAdminUpdateStatus
    | string
    | Omit<IReviewSubmissionDTO, "dealerId">
    | Omit<CreatePostDTO, "carId">,
): Promise<MainResponse<null>> {
  return request<MainResponse<null>>("put", url, data);
}

export async function deleteFetch(url: string): Promise<MainResponse<null>> {
  return request<MainResponse<null>>("delete", url, undefined, true);
}

export async function patchFetch(
  url: string,
  data?: { rejectionReason: string },
): Promise<MainResponse<null>> {
  return request<MainResponse<null>>("patch", url, data, true);
}
