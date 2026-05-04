import { getUserProfile } from "@/app/shared/utils/API/UserAPI";

export async function UserFetch() {
  const response = await getUserProfile();
  return response;
}
