"use server";

import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";
import { Tokens } from "../../../signIn/types/sign-in-response";
import { AdminResponse } from "../types/admin-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function adminAction(formData: FormData): Promise<AdminResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const res = await postFetch<Tokens>("api/v1/admin/login", {
      email,
      password,
    });

    return res;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      isSuccess: false,
      message: err.message || "An error occurred while logging in.",
      data: null,
      status: err.status || 500,
    };
  }
}

export type AdminAction = typeof adminAction;
