import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=missing-token", req.url),
    );
  }

  const normalizedToken = token.replace(/ /g, "+");
  const redirectUrl = new URL(
    `/auth/password/reset?token=${normalizedToken}`,
    req.url,
  );

  return NextResponse.redirect(redirectUrl);
}
