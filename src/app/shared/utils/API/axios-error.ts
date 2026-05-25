import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../errors/errorResponse";

type ApiErrorPayload = {
  isSuccess?: boolean;
  message?: string;
  data?: null;
  status?: number;
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

export const normalizeError = (
  error: unknown,
  context: string,
): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const payload = axiosError.response?.data;

    if (!axiosError.response) {
      console.error(
        `${context}: network error (${axiosError.code ?? "unknown"})`,
      );
      return new ErrorResponse(
        axiosError.message || "Network error — check your connection",
        0,
        null,
      );
    }

    const message = extractErrorMessage(payload, axiosError.message);
    const statusCode =
      axiosError.response?.status ?? extractErrorStatus(payload, 500);
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
