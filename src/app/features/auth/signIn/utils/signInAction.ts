"use server";

import { SignInResponse } from "../types/sign-in-response";
import { postFetch } from "@/utils/API/AxiosClient";

export async function signInAction(
  formData: FormData,
): Promise<SignInResponse> {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;

  try {
    const res = await postFetch("/api/v1/auth/login", {
      usernameOrEmail,
      password,
    });

    return res;
  } catch {
    return {
      isSuccess: false,
      message: "An error occurred while registering. Please try again.",
      data: null,
      status: 500,
    };
  }
}

export type SignInAction = typeof signInAction;
