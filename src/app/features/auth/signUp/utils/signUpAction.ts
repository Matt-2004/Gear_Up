"use server";

import { MainResponse } from "@/app/shared/types.ts/main-response";
import { postFetch } from "@/utils/API/AxiosClient";

export async function signUpAction(
  formData: FormData,
): Promise<MainResponse<string | null>> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  try {
    const res = await postFetch("/api/v1/auth/register", {
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
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

export type SignUpAction = typeof signUpAction;
