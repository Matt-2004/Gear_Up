import { GetMessagesRes } from "@/app/types/message.types";
import { API_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

// GET /api/messages/[userId] - Get all messages with a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    const response = await fetch(`${API_URL}/api/v1/messages/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: GetMessagesRes = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: error.status || 500 },
    );
  }
}

// DELETE /api/messages/[userId] - Delete all messages with a specific user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    const response = await fetch(`${API_URL}/api/v1/messages/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete messages" },
      { status: error.status || 500 },
    );
  }
}
