import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  console.log("Token received in route:", token);

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is required" }), {
      status: 400,
    });
  }

  const response = NextResponse.redirect(
    new URL(`/auth/createnewpassword`, request.url)
  );
  response.cookies.set("reset_token", token, {
    httpOnly: false, // set to true if only used server-side
    maxAge: 5000, // expires in 5 minutes
    sameSite: "lax",
    path: "/",
  });
  return response;
}
