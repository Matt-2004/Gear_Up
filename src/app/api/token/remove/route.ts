import { cookies } from "next/headers";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("session_access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_id");
  cookieStore.delete("user_data");
  return new Response(null, { status: 200 });
};
