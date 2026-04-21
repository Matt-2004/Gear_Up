import { NewPasswordDTO } from "@/types/auth.types";
import { getResetToken } from "../getClientCookie";
import { postFetch } from "./AxiosClient";

export async function resendVerificationEmail(email: string) {
  return postFetch(
    `/api/v1/auth/resend-verification-email?email=${email}`,
    null,
  );
}

export async function updateNewPassword(data: NewPasswordDTO) {
  const reset_token = await getResetToken();
  return postFetch(`/api/v1/auth/reset-password?token=${reset_token}`, data);
}
