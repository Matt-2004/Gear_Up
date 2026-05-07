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
import { Tokens } from "@/app/features/auth/signIn/types/sign-in-response";

export const api = axios.create({
  baseURL: BACKEND_API_URL,
});

async function refreshAccessToken(
  refreshToken: string,
  isProduction: boolean,
): Promise<void> {
  const cookieStore = await cookies();
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  try {
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
    const tokenData = data?.data ?? data;
    const nextAccessToken: string | undefined = tokenData?.accessToken;
    const nextRefreshToken: string | undefined = tokenData?.refreshToken;

    if (!nextAccessToken || !nextRefreshToken) {
      console.error("Token refresh response missing tokens");
      throw new Error("Token refresh failed");
    }

    cookieStore.set("access_token", nextAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 60 * 5, // 5 minutes
    });
    cookieStore.set("refresh_token", nextRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error) {
    console.error(
      "Error during token refresh:",
      error instanceof Error ? error.message : "Unknown error",
    );
    throw error;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const isProduction = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken(refreshToken, isProduction);
        const nextAccessToken = cookieStore.get("access_token")?.value;

        if (nextAccessToken && originalRequest) {
          originalRequest.headers = {
            ...(originalRequest.headers ?? {}),
            Authorization: `Bearer ${nextAccessToken}`,
          };
          return api.request(originalRequest);
        }
      } catch (refreshError) {
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
        return Promise.reject(refreshError);
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

const buildAuthHeaders = async (
  includeJsonContentType = false,
): Promise<Record<string, string>> => {
  const accessToken = await getServerAccessToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

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
    const message = extractErrorMessage(
      payload,
      axiosError.message || "Request failed",
    );
    const statusCode = extractErrorStatus(
      payload,
      axiosError.response?.status ?? 500,
    );
    console.error(`${context}:`, {
      statusCode,
      message,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
    });
    return new ErrorResponse(message, statusCode, null);
  }

  if (isApiErrorPayload(error)) {
    const message = extractErrorMessage(error, "Request failed");
    const statusCode = extractErrorStatus(error, 500);
    console.error(`${context}:`, { statusCode, message });
    return new ErrorResponse(message, statusCode, null);
  }

  return new ErrorResponse(
    error instanceof Error ? error.message : "Request failed",
    500,
    null,
  );
};

const request = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  includeJsonContentType = false,
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
      headers: await buildAuthHeaders(includeJsonContentType),
    });
    console.log(`Response for ${method.toUpperCase()} ${url}:`, response.data);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in request:", error);
    throw normalizeError(error, `Error in ${method.toUpperCase()} ${url}`);
  }
};

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
) {
  return request<MainResponse<null>>("put", url, data);
}

export async function deleteFetch(url: string) {
  return request<MainResponse<null>>("delete", url, undefined, true);
}

export async function patchFetch(
  url: string,
  data?: { rejectionReason: string },
) {
  return request("patch", url, data, true);
}
