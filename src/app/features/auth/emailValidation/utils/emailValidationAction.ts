"use server";

import { fetchAuthClientAPI } from "@/utils/Auth/fetchAuthClientAPI";
import { EmailValidationResponse } from "../types/email-validation-response";
import { EmailValidationVariant } from "../types/email-validation-request";

export async function emailValidationAction(
  formData: FormData,
  variant: EmailValidationVariant,
): Promise<EmailValidationResponse> {
  const email = (formData.get("email") as string) || "";

  try {
    const response = await fetchAuthClientAPI(
      "/features/auth/emailValidation/api",
      {
        email,
        variant,
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
