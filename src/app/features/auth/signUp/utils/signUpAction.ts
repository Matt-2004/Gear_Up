"use server";

import { MainResponse } from "@/app/shared/types.ts/main-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

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
    const res = await postFetch<null>("/api/v1/auth/register", {
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    });

    // Check if registration was successful
    if (res.status === 201) {
      return {
        isSuccess: res.isSuccess,
        message: "Registration successful, check your email for verification.",
        status: res.status,
        data: res.data,
      };
    }

    return res;
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error?.message || "Registration failed",
      data: null,
      status: error?.status || 500,
    };
  }
}

export type SignUpAction = typeof signUpAction;
