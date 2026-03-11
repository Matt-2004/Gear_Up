import { NewPasswordDTO } from "@/types/auth.types";
import { getResetToken } from "../getClientCookie";
import { apiPost } from "./AxiosClientBrowser";

export async function resendVerificationEmail(email: string) {
  return apiPost(`/api/auth/resend-verification-email?email=${email}`, null);
}

export async function updateNewPassword(data: NewPasswordDTO) {
  const reset_token = await getResetToken();
  return apiPost(`/api/auth/reset-password?token=${reset_token}`, data);
}
