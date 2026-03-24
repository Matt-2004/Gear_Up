import { AuthItem, ProfileDTO } from "@/types/auth.types";
import { profileItem } from "@/types/data.types";
import { UserItem } from "@/types/user.types";
import { cookies } from "next/headers";

export async function token_integration(data: AuthItem, rememberMe = true) {
  const cookieStore = await cookies();

  const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    ...(rememberMe ? { maxAge: 60 * 5 } : {}),
  };

  const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
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
  rememberMe = true,
) {
  const cookieStore = await cookies();

  const userDataCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  };

  cookieStore.set("user_data", userData, userDataCookieOptions);
}
