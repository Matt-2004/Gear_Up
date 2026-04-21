import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "access_token cookie not found",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: "access_token fetched successfully",
        data: accessToken,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        isSuccess: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch access_token",
        data: null,
      },
      { status: 500 },
    );
  }
}
