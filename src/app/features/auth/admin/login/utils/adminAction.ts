"use server";

import { AdminResponse } from "../types/admin-response";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

export async function adminAction(formData: FormData): Promise<AdminResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const res = await postFetch("api/v1/admin/login", {
    email,
    password,
  });

  return res;
}

export type AdminAction = typeof adminAction;
