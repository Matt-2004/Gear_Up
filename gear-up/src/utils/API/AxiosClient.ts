"use server"

import { IAdminLogin } from "@/app/types/admin.types"
import { createAppointmentDTO } from "@/app/types/appointment.types"
import { INewPassword } from "@/app/types/auth.types"
import { AddComment } from "@/app/types/comment.types"
import { IAdminUpdateStatus } from "@/app/types/kyc.types"
import { CreateMessageDTO } from "@/app/types/message.types"
import { CreatePostData } from "@/app/types/post.types"
import { API_URL } from "@/lib/config"
import axios from "axios"
import { cookies } from "next/headers"

export const api = axios.create({
	baseURL: API_URL,
})

export async function getFetch(url: string) {
	const access_token = (await cookies()).get("access_token")?.value

	// url & options
	try {
		const response = await api.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			},
		})
		return response.data
	} catch (error: any) {
		console.log({
			status: error?.response?.status,
			data: error?.response?.data,
			headers: error?.response?.headers,
		})

		throw error
	}
}

export async function postFetch(
	url: string,
	data:
		| INewPassword
		| IAdminLogin
		| FormData
		| null
		| AddComment
		| createAppointmentDTO
		| CreatePostData
		| Omit<CreatePostData, "carId">
		| CreateMessageDTO,
) {
	const access_token = (await cookies()).get("access_token")?.value

	// url & options
	try {
		const response = await api.post(url, data, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		})
		return response.data
	} catch (error: any) {
		console.log("Error in postFetch:", error?.response?.data)
		throw error
	}
}

export async function putFetch(
	url: string,
	data: FormData | IAdminUpdateStatus | string,
) {
	const access_token = (await cookies()).get("access_token")?.value
	// url & options
	try {
		const response = await api.put(url, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			},
		})
		return response.data
	} catch (error: any) {
		console.log("Error in putFetch:", error?.response?.data)
		throw error
	}
}

export async function deleteFetch(url: string) {
	const access_token = (await cookies()).get("access_token")?.value
	// url & options
	try {
		const response = await api.delete(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			},
		})
		return response.data
	} catch (error: any) {
		console.log("Error in deleteFetch:", error?.response?.data)
		throw error
	}
}

export async function patchFetch(url: string) {
	const access_token = (await cookies()).get("access_token")?.value
	try {
		const respones = await api.patch(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			},
		})
		return respones.data
	} catch (error: any) {
		console.log("Error in patchFetch:", error?.response?.data)
		throw error
	}
}
