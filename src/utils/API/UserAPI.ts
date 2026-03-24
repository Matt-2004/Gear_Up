import { UserItem, UserResponse } from "@/types/user.types";
import { apiFetch, apiPost, apiPut } from "./AxiosClientBrowser";
import { API_URL } from "@/lib/config";

export async function getUserProfile(accessToken?: string) {
  // If an access token is provided (e.g. immediately after login), call
  // backend directly to avoid cookie propagation timing issues.
  if (accessToken) {
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = (await res.json()) as UserResponse<UserItem>;

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to fetch user profile");
    }

    return data satisfies UserResponse<UserItem>;
  }

  return (await apiFetch("/api/users/me")) satisfies UserResponse<UserItem>;
}

export async function updateUserProfile(formdata: FormData) {
  return apiPut("/api/users/me", formdata);
}

export async function getUserByUserId(userId: string) {
  return apiFetch(`/api/users/${userId}`);
}

export async function getPostByUserId(userId: string, cursor?: string) {
  return apiFetch(`/api/users/${userId}/posts?cursor=${cursor}`);
}

export async function getCarByUserId(userId: string, cursor?: string) {
  return apiFetch(`/api/users/${userId}/cars?cursor=${cursor}`);
}

export async function kycRegister(data: FormData) {
  return apiPost("/api/users/kyc", data);
}
