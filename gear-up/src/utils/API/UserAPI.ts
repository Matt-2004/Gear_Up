import { UserItem, UserResponse } from "@/app/types/user.types"
import { getFetch, postFetch, putFetch } from "./AxiosClient"

export async function getUserProfile() {
	const res = await getFetch("/api/v1/users/me")
	return res satisfies UserResponse<UserItem>
}

export async function updateUserProfile(formdata: FormData) {
	const res = await putFetch("/api/v1/users/me", formdata)
	return res
}

export async function getUserByUserId(userId: string) {
	const res = await getFetch(`/api/v1/users/${userId}`)
	return res
}

export async function getPostByUserId(userId: string, cursor?: string) {
	const res = await getFetch(`/api/v1/user/${userId}/posts?cursor=${cursor}`)
	return res
}

export async function getCarByUserId(userId: string, cursor?: string) {
	const res = await getFetch(`/api/v1/user/${userId}/cars?cursor=${cursor}`)
	return res
}

export async function kycRegister(data: FormData) {
	const response = await postFetch("/api/v1/users/kyc", data)
	return response
}
