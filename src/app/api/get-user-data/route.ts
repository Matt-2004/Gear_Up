import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/shared/utils/AuthUtils/encryption";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("user_data")?.value;

    if (!userDataCookie) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "user_data cookie not found",
          data: null,
        },
        { status: 404 },
      );
    }

    const parsedUserData = await decrypt(userDataCookie);

    return NextResponse.json(
      {
        isSuccess: true,
        message: "user_data cookie fetched successfully",
        data: parsedUserData,
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
            : "Failed to fetch user_data cookie",
        data: null,
      },
      { status: 500 },
    );
  }
}
