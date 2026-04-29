"use server";

import { AdminLoginDTO } from "@/app/features/dashboards/admin/types/admin.types";
import { createAppointmentDTO } from "@/app/features/appointments/types/appointment.types";
import {
  LoginDTO,
  ResetPasswordDTO,
} from "@/app/features/auth/types/auth.types";
import { AddComment } from "@/app/features/comment/types/comment.types";
import { IAdminUpdateStatus } from "@/app/features/dashboards/dealer/types/kyc.types";
import { CreateMessageDTO } from "@/app/features/messaging/types/message.types";
import { CreatePostData } from "@/app/features/post/types/post.types";
import { IReviewSubmissionDTO } from "@/app/features/review/types/review.types";
import { BACKEND_API_URL } from "@/app/shared/utils/config";
import { getServerAccessToken } from "@/app/shared/utils/AuthUtils/tokenUtils";
import axios, { AxiosError } from "axios";
import { SubmitVehicle } from "@/app/features/dashboards/dealer/context/AddNewCarContext";
import { EmailValidationRequest } from "@/app/features/auth/emailValidation/types/email-validation-request";
import { SignUpDTO } from "@/app/features/auth/signUp/types/sign-up-dto";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { ErrorResponse } from "../errors/errorResponse";

export const api = axios.create({
  baseURL: BACKEND_API_URL,
});

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
  | LoginDTO
  | ResetPasswordDTO
  | AdminLoginDTO
  | FormData
  | null
  | AddComment
  | createAppointmentDTO
  | CreatePostData
  | Omit<CreatePostData, "carId">
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
    | Omit<CreatePostData, "carId">,
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
