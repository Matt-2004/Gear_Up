"use server";

import { ResetPasswordResponse } from "../types/reset-password-response";
import { postFetch } from "@/utils/API/AxiosClient";

export async function resetPasswordAction(
  formData: FormData,
): Promise<ResetPasswordResponse> {
  const newPassword = formData.get("newPassword") as string;
  const confirmedPassword = formData.get("confirmPassword") as string;
  const token = formData.get("token") as string;

  try {
    const response = await postFetch(
      `/api/v1/auth/reset-password?token=${token}`,
      {
        newPassword,
        confirmedPassword,
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
