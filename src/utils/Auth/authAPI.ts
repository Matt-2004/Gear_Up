"use server";

import { IAdminLogin } from "@/types/admin.types";
import { LoginDTO, RegisterDTO } from "@/types/auth.types";
import { encrypt } from "../encryption";
import { FetchAuthAPI } from "./FetchAuthAPI";
import { token_integration, user_data_integration } from "./CookieIntegration";
import { UserFetch } from "../User/UserFetch";

interface AuthOptions {
  rememberMe?: boolean;
}

// type guard
function isRegisterDTO(
  payload: LoginDTO | RegisterDTO | IAdminLogin,
): payload is RegisterDTO {
  return "confirmPassword" in payload;
}

export async function authAPI(
  url: string,
  payload: LoginDTO | RegisterDTO | IAdminLogin,
  options?: AuthOptions,
) {
  const rememberMe = options?.rememberMe ?? true;

  // Step 1: authenticate against the local Next.js auth route handler.
  const res = await FetchAuthAPI(url, payload);

  if (isRegisterDTO(payload)) {
    return;
  }

  // Step 2: persist auth tokens immediately after successful login/register.
  await token_integration(res.data, rememberMe);

  // Step 3: best-effort profile hydration.
  // Important: if this fails, authentication is still valid and should not
  // surface as a login failure in the UI.
  try {
    // Use freshly issued access token for the immediate profile request.
    const userRes = await UserFetch(res.data.accessToken);
    const encryptedUserData = await encrypt(userRes.data);
    await user_data_integration(encryptedUserData, rememberMe);
  } catch (error) {
    // Non-blocking: profile fetch can fail transiently right after token set.
    console.error("Post-login user profile integration failed:", error);
  }
}
