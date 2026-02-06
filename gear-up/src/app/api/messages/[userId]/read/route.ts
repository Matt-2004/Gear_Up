import { API_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/messages/[userId]/read - Mark all messages with a user as read
export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    const response = await fetch(`${API_URL}/api/v1/messages/${userId}/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to mark messages as read" },
      { status: error.status || 500 },
    );
  }
}
