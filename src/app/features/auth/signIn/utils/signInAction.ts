"use server";

import { MainResponse } from "@/app/shared/types.ts/main-response";
import { SignInResponse, Tokens } from "../types/sign-in-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function signInAction(
  formData: FormData,
): Promise<SignInResponse> {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;

  try {
    const res = await postFetch<Tokens>("/api/v1/auth/login", {
      usernameOrEmail,
      password,
    });
    return res;
  } catch (error: unknown) {
    const err = error as MainResponse<null>;
    if (err.status === 403) {
      const res = await postFetch<null>(
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
    return {
      isSuccess: false,
      message: err?.message || "Sign-in failed",
      data: null,
      status: err?.status || 500,
    };
  }

  // Check if the user is not verified
}

export type SignInAction = typeof signInAction;
