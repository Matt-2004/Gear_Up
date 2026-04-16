import { UserItem, UserResponse } from "@/types/user.types";
import { apiFetch, apiPost, apiPut } from "./AxiosClientBrowser";

export async function getUserProfile() {
  return await apiFetch("/api/users/me");
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
