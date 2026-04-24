import { getUserProfile } from "@/app/shared/utils/API/UserAPI";
import { UserResponse } from "@/app/features/navbar/types/user.types";

export async function UserFetch() {
  const response = await getUserProfile();
  return response as UserResponse;
}
