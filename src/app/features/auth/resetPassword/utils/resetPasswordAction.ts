"use server";

import { fetchAuthClientAPI } from "@/utils/Auth/fetchAuthClientAPI";
import { ResetPasswordResponse } from "../types/reset-password-response";

export async function resetPasswordAction(
  formData: FormData,
): Promise<ResetPasswordResponse> {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  try {
    const response = await fetchAuthClientAPI(
      "/features/auth/resetPassword/api",
      {
        newPassword,
        confirmePassword: confirmPassword,
      },
    );

    return response;
  } catch {
    return {
      isSuccess: false,
      message: "An error occurred while resetting password.",
      data: null,
      status: 500,
    };
  }
}

export type ResetPasswordAction = typeof resetPasswordAction;
