"use server";

import { EmailValidationResponse } from "../types/email-validation-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function emailValidationAction(
  formData: FormData,
): Promise<EmailValidationResponse> {
  const email = formData.get("email") as string;

  try {
    const response = await postFetch<null>(
      `/api/v1/auth/send-password-reset-token?email=${email}`,
      {
        email,
      },
    );

    return response;
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error?.message || "An error occurred while validating email.",
      data: null,
      status: error?.status || 500,
    };
  }
}

export type EmailValidationAction = typeof emailValidationAction;
