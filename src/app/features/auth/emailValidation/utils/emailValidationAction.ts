"use server";

import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";
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
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      isSuccess: false,
      message: err.message || "An error occurred while validating email.",
      data: null,
      status: err.status || 500,
    };
  }
}

export type EmailValidationAction = typeof emailValidationAction;
