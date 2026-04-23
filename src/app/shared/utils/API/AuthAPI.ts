import { NewPasswordDTO } from "@/app/features/auth/types/auth.types";
import { getResetToken } from "@/app/shared/utils/AuthUtils/getClientCookie";
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
