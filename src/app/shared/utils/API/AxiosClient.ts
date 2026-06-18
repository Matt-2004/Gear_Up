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
import axios from "axios";
import { SubmitVehicle } from "@/app/features/profiles/dealer/context/AddNewCarContext";
import { EmailValidationRequest } from "@/app/features/auth/emailValidation/types/email-validation-request";
import { SignUpDTO } from "@/app/features/auth/signUp/types/sign-up-dto";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { normalizeError } from "./axios-error";
import { CreatePostDTO } from "@/app/features/post/types/post.dto";
import { AddCommentDTO } from "@/app/features/comment/types/comment.dto";
import { IReviewSubmissionDTO } from "@/app/features/review/types/review.dto";
import { createAppointmentDTO } from "@/app/features/appointments/types/appointment.dto";
import { cookies } from "next/headers";
import { Tokens } from "@/app/features/auth/signIn/types/sign-in-response";
import { token_integration } from "../AuthUtils/CookieIntegration";

export const api = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 15_000,
});

// ─── Token refresh ───────────────────────────────────────────────────

let refreshPromise: Promise<Tokens> | null = null;

async function refreshAccessToken(refreshToken: string): Promise<Tokens> {
  const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(refreshToken),
  });

  if (!res.ok) {
    console.error(`Token refresh failed: ${res.status} ${res.statusText}`);
    throw new Error("Token refresh failed");
  }

  const data = await res.json();
  const tokenData: Tokens = data?.data ?? data;

  if (!tokenData.accessToken || !tokenData.refreshToken) {
    console.error("Token refresh response missing tokens");
    throw new Error("Token refresh failed");
  }

  return tokenData;
}

// ─── Retry config ─────────────────────────────────────────────────────

const RETRY_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = [1000, 2000, 4000];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Response interceptor: retry on transient errors only ────────────
// ⚠️  401 is intentionally NOT handled here — Axios interceptors run
//     outside Next.js's AsyncLocalStorage context, so cookies().set()
//     throws "Cookies can only be modified in a Server Action or Route Handler".
//     The 401 + refresh logic lives inside request() instead.

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as
      | (typeof error.config & { _retryCount?: number })
      | undefined;

    if (!config) return Promise.reject(error);

    const retryCount = config._retryCount ?? 0;
    const isGet = config.method?.toLowerCase() === "get";
    const isRetryableStatus =
      error.response?.status && RETRY_STATUS_CODES.has(error.response.status);
    const isNetworkError = !error.response;

    if (
      isGet &&
      (isRetryableStatus || isNetworkError) &&
      retryCount < MAX_RETRIES
    ) {
      config._retryCount = retryCount + 1;
      await delay(RETRY_DELAY_MS[retryCount] ?? 4000);
      return api.request(config);
    }

    return Promise.reject(error);
  },
);

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

function isFormData(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

// ─── Core request (called directly from Server Actions) ──────────────
// Because this runs within the Server Action call stack, Next.js's
// AsyncLocalStorage context is intact — cookies().set() works here.

async function request<TResponse>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  forceJsonContentType = false,
): Promise<TResponse> {
  const hasBody = data !== undefined && data !== null;
  const useJsonHeader = forceJsonContentType || (hasBody && !isFormData(data));

  try {
    const response = await api.request<TResponse>({
      method,
      url,
      data,
      headers: await buildAuthHeaders(useJsonHeader),
    });

    return response.data;
  } catch (error: unknown) {
    // ─── 401: refresh + retry, right here in the Server Action context ──
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const cookieStore = await cookies();
        const storedRefreshToken = cookieStore.get("refresh_token")?.value;

        if (!storedRefreshToken) {
          throw error; // No refresh token — propagate the 401
        }

        // Deduplicate concurrent refresh calls
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken(storedRefreshToken);
        }

        const tokens = await refreshPromise;
        console.log("Token refresh successful:", tokens);
        refreshPromise = null;

        // ✅ Safe here: we're still on the Server Action call stack
        // await fetch(`${DEFAULT_API_URL}/api/token/refresh`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(tokens),
        // });

        await token_integration(tokens, true); // Update cookies with new tokens

        // Retry the original request with the fresh access token
        const retried = await api.request<TResponse>({
          method,
          url,
          data,
          headers: {
            ...(useJsonHeader ? { "Content-Type": "application/json" } : {}),
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        return retried.data;
      } catch (refreshError) {
        refreshPromise = null;
        throw normalizeError(
          refreshError,
          `Token refresh → ${method.toUpperCase()} ${url}`,
        );
      }
    }

    throw normalizeError(error, `${method.toUpperCase()} ${url}`);
  }
}

// ─── Public fetch helpers ─────────────────────────────────────────────

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
