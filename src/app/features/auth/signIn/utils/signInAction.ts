"use server";

import { SignInResponse } from "../types/sign-in-response";
import { postFetch } from "@/utils/API/AxiosClient";

export async function signInAction(
  formData: FormData,
): Promise<SignInResponse> {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;

  const res = await postFetch("/api/v1/auth/login", {
    usernameOrEmail,
    password,
  });

  // Check if the user is not verified
  if (res.status === 403) {
    const res = await postFetch(
      `/api/v1/auth/resend-verification-email?email=${usernameOrEmail}`,
      null,
    );
    if (res.isSuccess) {
      return {
        isSuccess: false,
        message:
          "Your email is not verified. Please check your email for the verification link.",
        data: null,
        status: 403,
      };
    }
    return res;
  }

  return res;
}

export type SignInAction = typeof signInAction;
