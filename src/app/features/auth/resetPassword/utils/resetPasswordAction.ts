"use server";

import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";
import { ResetPasswordResponse } from "../types/reset-password-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function resetPasswordAction(
  formData: FormData,
): Promise<ResetPasswordResponse> {
  const newPassword = formData.get("newPassword") as string;
  const confirmedPassword = formData.get("confirmedPassword") as string;
  const token = formData.get("token") as string;

  try {
    const response = await postFetch<null>(
      `/api/v1/auth/reset-password?token=${token}`,
      {
        newPassword,
        confirmedPassword,
      },
    );

    return response;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      isSuccess: false,
      message: err?.message || "An error occurred while validating email.",
      data: null,
      status: err?.status || 500,
    };
  }
}

export type ResetPasswordAction = typeof resetPasswordAction;
