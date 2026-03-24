import { UserItem, UserResponse } from "@/types/user.types";
import { ResponseError } from "../Auth/ResponseError";
import { getUserProfile } from "../API/UserAPI";

export async function UserFetch(
  accessToken?: string,
): Promise<UserResponse<UserItem>> {
  try {
    const response = await getUserProfile(accessToken);
    return response satisfies UserResponse<UserItem>;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      throw error;
    }

    const fallbackMessage =
      error instanceof Error ? error.message : "Failed to fetch user profile";
    const fallbackStatus = 500;

    throw new ResponseError(fallbackMessage, fallbackStatus);
  }
}
