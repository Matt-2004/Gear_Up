"use server";

import { authAPI } from "@/utils/Auth/authAPI";

export interface AdminLoginActionState {
  status: "idle" | "success" | "error";
  message: string;
  submittedAt: number;
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
      response?: { message?: unknown; data?: unknown };
      data?: unknown;
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
  }

  return "Login failed. Please try again.";
};

export const initialAdminLoginActionState: AdminLoginActionState = {
  status: "idle",
  message: "",
  submittedAt: 0,
};

export async function adminLoginAction(
  _prevState: AdminLoginActionState,
  formData: FormData,
): Promise<AdminLoginActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await authAPI("/api/auth/admin/login", { email, password });
    return {
      status: "success",
      message: "Login successful! Redirecting...",
      submittedAt: Date.now(),
    };
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error),
      submittedAt: Date.now(),
    };
  }
}
