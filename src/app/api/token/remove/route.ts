import { BACKEND_API_URL } from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/auth/logout`, {
      method: "POST",
    });
    const res = NextResponse.json({
      isSuccess: true,
      message: "Logged out successfully",
    });

    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    res.cookies.delete("user_data");

    return res;
  } catch (error) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to remove tokens",
      },
      { status: 500 },
    );
  }
}
