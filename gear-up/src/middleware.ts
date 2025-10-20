import { NextResponse, NextRequest } from "next/server";
import { API_URL } from "./lib/config";
import { cookies } from "next/headers";
import { parseSetCookieHeader } from "./utils/parseSetCookieHeader";

const tokenRotation = async (token: string) => {
  // const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: token,
    },
  });
  return res;
};

export async function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token") || undefined;
  const refresh_token = cookieStore.get("refresh_token") || undefined;
  if (access_token == undefined && refresh_token) {
    try {
      const res = await tokenRotation(cookieHeader);

      if (res.ok) {
        console.log("Token Validation Successful");
        const response = NextResponse.next();
        const newCookie = res.headers.get("set-cookie");
        const cookiesObj = parseSetCookieHeader(newCookie);

        if (newCookie) {
          if (cookiesObj.access_token) {
            response.cookies.set("access_token", cookiesObj.access_token, {
              path: "/",
              secure: true,
              sameSite: "strict",
            });
          }
          if (cookiesObj.refresh_token) {
            response.cookies.set("refresh_token", cookiesObj.refresh_token, {
              path: "/",
              secure: true,
              sameSite: "strict",
              httpOnly: true,
            });
          }
          return response;
        }
      }

      console.log("Token invalid, redirecting...");
    } catch (err) {
      console.error("Middleware Error:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // or your protected routes
};
