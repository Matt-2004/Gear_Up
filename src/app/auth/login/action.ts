"use server";

import { authAPI } from "@/utils/Auth/authAPI";

interface AuthSubmitResult {
  isSuccess: boolean;
  message: string;
}

const getErrorMessage = (error: unknown): string => {
  if (!error) return "Login failed. Please try again.";

  if (typeof error === "string") return error;

  if (error instanceof Error) {
    return error.message || "Login failed. Please try again.";
  }

  if (typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      response?: { message?: unknown; data?: unknown; error?: unknown };
      data?: unknown;
      error?: unknown;
    };

    if (typeof maybeError.response?.message === "string") {
      return maybeError.response.message;
    }

    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }

    if (typeof maybeError.data === "string") {
      return maybeError.data;
    }

    if (typeof maybeError.error === "string") {
      return maybeError.error;
    }
  }

  return "Login failed. Please try again.";
};

export async function loginSubmit(
  formData: FormData,
): Promise<AuthSubmitResult> {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  try {
    await authAPI(
      `/api/auth/login`,
      {
        usernameOrEmail,
        password,
      },
      { rememberMe },
    );

    return {
      isSuccess: true,
      message: "Login successful!",
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: getErrorMessage(error),
    };
  }
}
