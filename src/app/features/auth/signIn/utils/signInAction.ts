"use server";

import { fetchAuthClientAPI } from "@/utils/Auth/fetchAuthClientAPI";
import { SignInResponse } from "../types/sign-in-response";

export async function signInAction(
  formData: FormData,
): Promise<SignInResponse> {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetchAuthClientAPI("/features/auth/signIn/api", {
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
