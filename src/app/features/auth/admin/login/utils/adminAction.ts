"use server";

import { fetchAuthClientAPI } from "@/utils/Auth/fetchAuthClientAPI";
import { AdminResponse } from "../types/admin-response";

export async function adminAction(formData: FormData): Promise<AdminResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetchAuthClientAPI("/features/auth/admin/api", {
      email,
      password,
    });

    return res;
  } catch {
    return {
      isSuccess: false,
      message: "An error occurred while logging in. Please try again.",
      data: null,
      status: 500,
    };
  }
}

export type AdminAction = typeof adminAction;
