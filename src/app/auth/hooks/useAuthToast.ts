import { useCallback } from "react";
import { useToast } from "@/app/hooks/useToast";

interface AuthToastConfig {
  onSuccess?: {
    message?: string;
    redirectPath?: string;
  };
  onError?: {
    message?: string;
  };
}

const GENERIC_ERROR_MESSAGES = new Set([
  "Failed to authenticate",
  "Request failed",
  "Network Error",
  "An error occurred.",
]);

const DEFAULT_SUCCESS_MESSAGE = "Operation successful!";
const DEFAULT_ERROR_MESSAGE = "An error occurred.";
const SUCCESS_DURATION = 3000;
const INFO_DURATION = 3000;
const ERROR_DURATION = 6000;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isGenericMessage = (value: string): boolean =>
  GENERIC_ERROR_MESSAGES.has(value.trim());

const normalizeMessage = (value: unknown): string | null => {
  if (isNonEmptyString(value)) {
    const message = value.trim();
    return isGenericMessage(message) ? null : message;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = normalizeMessage(item);
      if (message) return message;
    }
  }

  return null;
};

const extractMessageFromString = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return extractErrorMessage(JSON.parse(trimmed));
    } catch {
      return normalizeMessage(trimmed);
    }
  }

  const jsonStart = trimmed.indexOf("{");
  if (jsonStart !== -1) {
    const maybeJson = trimmed.slice(jsonStart);
    try {
      return extractErrorMessage(JSON.parse(maybeJson));
    } catch {
      return normalizeMessage(trimmed);
    }
  }

  return normalizeMessage(trimmed);
};

const extractErrorMessage = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === "string") {
    return extractMessageFromString(value);
  }

  if (value instanceof Error) {
    const err = value as Error & {
      cause?: unknown;
      response?: unknown;
      data?: unknown;
      error?: unknown;
    };

    return (
      extractErrorMessage(err.response) ??
      extractErrorMessage(err.data) ??
      extractErrorMessage(err.error) ??
      extractErrorMessage(err.cause) ??
      extractMessageFromString(err.message)
    );
  }

  if (isRecord(value)) {
    const response = isRecord(value.response) ? value.response : undefined;
    const data = isRecord(value.data) ? value.data : value.data;
    const error = isRecord(value.error) ? value.error : value.error;

    return (
      extractErrorMessage(response?.message) ??
      extractErrorMessage(response?.data) ??
      extractErrorMessage(data) ??
      extractErrorMessage(error) ??
      extractErrorMessage(value.cause) ??
      extractErrorMessage(value.message)
    );
  }

  return null;
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  extractErrorMessage(error) ?? fallback;

/**
 * Custom hook to manage authentication-specific toast notifications
 * Provides callbacks for handling success and error states independently
 */
export const useAuthToast = (config: AuthToastConfig) => {
  const { addToastMessage, removeToastMessage } = useToast({
    toastType: null,
    message: null,
  });

  const showSuccessToast = useCallback(
    (message?: string) => {
      const toastMessage =
        message ?? config.onSuccess?.message ?? DEFAULT_SUCCESS_MESSAGE;
      addToastMessage("success", toastMessage, SUCCESS_DURATION);
    },
    [addToastMessage, config.onSuccess?.message],
  );

  const showErrorToast = useCallback(
    (error?: unknown) => {
      const fallback = config.onError?.message ?? DEFAULT_ERROR_MESSAGE;
      const toastMessage = getErrorMessage(error, fallback);
      addToastMessage("error", toastMessage, ERROR_DURATION);
    },
    [addToastMessage, config.onError?.message],
  );

  const showInfoToast = useCallback(
    (message: string) => {
      addToastMessage("info", message, INFO_DURATION);
    },
    [addToastMessage],
  );

  const hideToast = useCallback(
    (delay?: number) => {
      if (delay !== undefined) {
        setTimeout(() => {
          removeToastMessage();
        }, delay);
      }
    },
    [removeToastMessage],
  );

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    hideToast,
  };
};
