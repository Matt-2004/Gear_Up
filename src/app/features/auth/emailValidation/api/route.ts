import { BACKEND_API_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import {
  EmailValidationRequest,
  EmailValidationVariant,
} from "../types/email-validation-request";

const endpointByVariant: Record<EmailValidationVariant, string> = {
  verification: "/api/v1/auth/resend-verification-email",
  "reset-password": "/api/v1/auth/send-password-reset-token",
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as EmailValidationRequest;
  const email = body?.email ?? "";
  const variant = body?.variant ?? "verification";

  try {
    const endpoint =
      endpointByVariant[variant] ?? endpointByVariant.verification;
    const response = await fetch(
      `${BACKEND_API_URL}${endpoint}?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json().catch(() => null);

    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Server Error, please try again later",
        data: null,
        status: 500,
      },
      { status: 500 },
    );
  }
}
