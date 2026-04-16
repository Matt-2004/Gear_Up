import { LoginDTO } from "@/types/auth.types";
import { DEFAULT_API_URL } from "@/lib/config";

import { IAdminLogin } from "@/types/admin.types";
import { EmailValidationRequest } from "@/app/features/auth/emailValidation/types/email-validation-request";
import { ResetPasswordRequest } from "@/app/features/auth/resetPassword/types/reset-password-request";
import { SignUpDTO } from "@/app/features/auth/signUp/types/sign-up-dto";

export async function fetchAuthClientAPI(
  url: string,
  payload:
    | LoginDTO
    | SignUpDTO
    | IAdminLogin
    | EmailValidationRequest
    | ResetPasswordRequest,
) {
  try {
    const res = await fetch(`${DEFAULT_API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const response = await res.json();

    return response;
  } catch (error) {
    console.error("Error in fetchAuthClientAPI:", error);
    return {
      isSuccess: false,
      message: "An error occurred while fetching authentication data.",
      data: null,
      status: 500,
    };
  }
}
