"use server";

import { EmailValidationResponse } from "../types/email-validation-response";
import { postFetch } from "@/utils/API/AxiosClient";

export async function emailValidationAction(
  formData: FormData,
): Promise<EmailValidationResponse> {
  const email = (formData.get("email") as string) || "";

  try {
    const response = await postFetch(
      `/api/v1/auth/send-password-reset-token?email=${email}`,
      {
        email,
      },
    );

    return response;
  } catch {
    return {
      isSuccess: false,
      message: "An error occurred while submitting email validation.",
      data: null,
      status: 500,
    };
  }
}

export type EmailValidationAction = typeof emailValidationAction;
