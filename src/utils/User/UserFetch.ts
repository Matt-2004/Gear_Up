import { UserItem, UserResponse } from "@/types/user.types";

import { getUserProfile } from "../API/UserAPI";

export async function UserFetch(accessToken?: string) {
  const response = await getUserProfile();
  return response as UserResponse<UserItem>;
}
