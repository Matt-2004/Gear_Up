"use server";

import { ResetPasswordResponse } from "../types/reset-password-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function resetPasswordAction(
  formData: FormData,
): Promise<ResetPasswordResponse> {
  const newPassword = formData.get("newPassword") as string;
  const confirmedPassword = formData.get("confirmPassword") as string;
  const token = formData.get("token") as string;

  const response = await postFetch(
    `/api/v1/auth/reset-password?token=${token}`,
    {
      newPassword,
      confirmedPassword,
    },
  );

  return response;
}

export type ResetPasswordAction = typeof resetPasswordAction;
