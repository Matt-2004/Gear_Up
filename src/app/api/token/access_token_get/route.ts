import { NextResponse } from "next/server";
import { getServerAccessToken } from "@/utils/Auth/tokenUtils";

export const GET = async () => {
  const access_token = await getServerAccessToken();
  return NextResponse.json({ access_token });
};
