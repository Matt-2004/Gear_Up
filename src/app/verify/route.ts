import { BACKEND_API_URL, DEFAULT_API_URL } from "@/app/shared/utils/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is required" }), {
      status: 400,
    });
  }

  // Call your backend API to verify the token
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/v1/auth/verify-email?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ message: errorData }), {
        status: response.status,
      });
    }

    const redirectUrl = DEFAULT_API_URL ?? request.url;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
