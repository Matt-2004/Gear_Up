"use server";

import { EmailValidationResponse } from "../types/email-validation-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function emailValidationAction(
  formData: FormData,
): Promise<EmailValidationResponse> {
  const email = (formData.get("email") as string) || "";

  const response = await postFetch(
    `/api/v1/auth/send-password-reset-token?email=${email}`,
    {
      email,
    },
  );

  return response;
}

export type EmailValidationAction = typeof emailValidationAction;
