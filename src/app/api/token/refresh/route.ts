import { Tokens } from "@/app/features/auth/signIn/types/sign-in-response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data: Tokens = await req.json();
  console.log("Received token refresh request: ", data);

  try {
    const response = NextResponse.json({
      isSuccess: true,
      message: "Tokens refreshed successfully",
    });

    response.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5,
    });

    response.cookies.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return new Response(JSON.stringify({ error: "Failed to refresh token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
