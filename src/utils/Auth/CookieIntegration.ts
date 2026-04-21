"use server";

import { Tokens } from "@/app/features/auth/signIn/types/sign-in-response";
import { cookies } from "next/headers";

export async function token_integration(data: Tokens, rememberMe?: boolean) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  const accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 60 * 5,
  };

  const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  };

  cookieStore.set("access_token", data.accessToken, accessTokenCookieOptions);
  cookieStore.set(
    "refresh_token",
    data.refreshToken,
    refreshTokenCookieOptions,
  );
}

export async function user_data_integration(
  userData: string,
  rememberMe?: boolean,
) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  const userDataCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  };

  cookieStore.set("user_data", userData, userDataCookieOptions);
}
