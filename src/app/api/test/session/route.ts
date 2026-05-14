import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/app/shared/utils/AuthUtils/encryption";
import type { UserModel } from "@/app/features/profiles/user/types/user.model";

const buildUserData = (role: UserModel["role"]): UserModel => ({
  id: "e2e-user",
  provider: null,
  displayName: "E2E User",
  email: "e2e@test.com",
  realName: "E2E User",
  role,
  dateOfBirth: "1990-01-01",
  phone: 1234567890,
  profileImage: "",
});

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const roleParam = url.searchParams.get("role");
  const role = (roleParam as UserModel["role"]) ?? "Dealer";

  const userData = buildUserData(role);
  const encryptedUserData = await encrypt(userData);

  const res = NextResponse.json({ ok: true, role });

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
  };

  res.cookies.set("access_token", "e2e-access-token", {
    ...cookieOptions,
    maxAge: 60 * 5,
  });
  res.cookies.set("refresh_token", "e2e-refresh-token", {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
  res.cookies.set("user_data", encryptedUserData, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
