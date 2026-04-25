import { getFetch, putFetch, postFetch } from "./AxiosClient";

export async function getUserProfile() {
  return await getFetch("/api/v1/users/me");
}

export async function updateUserProfile(formdata: FormData) {
  return putFetch("/api/v1/users/me", formdata);
}

export async function getUserByUserId(userId: string) {
  return getFetch(`/api/v1/users/${userId}`);
}

export async function getPostByUserId(userId: string, cursor?: string) {
  return getFetch(`/api/v1/users/${userId}/posts?cursor=${cursor}`);
}

export async function getCarByUserId(userId: string, cursor?: string) {
  return getFetch(`/api/v1/users/${userId}/cars?cursor=${cursor}`);
}

export async function kycRegister(data: FormData) {
  return postFetch<null>("/api/v1/users/kyc", data);
}
