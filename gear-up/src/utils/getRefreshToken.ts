"use server";

import { cookies } from "next/headers";

export const getRefreshToken = async () => {
  const cookieStore = cookies();
  const refresh_token = (await cookieStore).get("refresh_token");
  if (refresh_token) {
    return true;
  }
  return false;
};
