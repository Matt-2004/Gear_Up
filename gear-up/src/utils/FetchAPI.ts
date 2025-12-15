"use server"

import { IAdminLogin } from "@/app/types/admin.types"
import { ILogin, INewPassword, IRegister } from "@/app/types/auth.types"
import { IKycUpdateByAdmin } from "@/app/types/kyc.types"
import { API_URL } from "@/lib/config"
import axios, { isAxiosError } from "axios"
import { cookies } from "next/headers"
import { getResetToken } from "./getClientCookie"

// Login & Registration -> Token integration
// The rest -> Token Check

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

export const backendFetchTokenIntegration = async (
	url: string,
	method: "post",
	data: ILogin | IRegister,
) => {
	const response = await api({
		url: url,
		method: method,
		data: data,
	})

	return response.data
}

export const rotateRefreshToken = async () => {
	try {
		const refreshToken =
			(await cookies()).has("refresh_token") &&
			(await cookies()).get("refresh_token")?.value
		const cookieStore = await cookies()
		const response = await axios.post(
			`${API_URL}/api/v1/auth/refresh`,
			refreshToken,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
		if (response.data?.data.accessToken) {
			cookieStore.set("access_token", response.data.data.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "lax",
				path: "/",
				maxAge: 60 * 5, // 10 minutes
			})
		}
		if (response.data?.data.refreshToken) {
			cookieStore.set("refresh_token", response.data.data.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "lax",
				path: "/",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			})
		}
		return response.data
	} catch (error: unknown) {
		// Type the caught error as unknown initially
		if (isAxiosError(error)) {
			// Now TypeScript knows 'error' is an AxiosError
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx.
				return error.response
			} else if (error.request) {
				// The request was made but no response was received.
				return error.request
			} else {
				// Something happened in setting up the request that triggered an Error.
				return error.message
			}
		} else {
			// Handle other types of errors (e.g., network errors not from Axios)
			return error
		}
	}
}

// export async function login(formData: ILogin) {
// 	const res = await api.post(`/api/v1/auth/login`, formData)

// 	return res.data
// }

export async function register(formData: IRegister) {
	const res = await api.post(`/api/v1/auth/register`, formData)
	return res.data
}

// Require access token in the header
export async function resendVerificationEmail(email: string) {
	const res = await api.post(
		`/api/v1/auth/resend-verification-email/email?=${email}`,
	)
	return res?.data
}

export async function updateNewPassword(formData: INewPassword) {
	const reset_token = await getResetToken()

	const res = await api.post(
		`/api/v1/auth/reset-password?token=${reset_token}`,
		formData,
	)
	return res?.data
}

export async function getUserProfile() {
	const res = await api.get("/api/v1/users/me")
	return res?.data
}

export async function updateUserProfile(formdata: FormData) {
	const response = api.put("/api/v1/users/me", formdata)
	return response
}

export async function kycRegister(data: FormData) {
	const response = await api.post("/api/v1/users/kyc", data)
	return response?.data
}

export async function adminLogin(data: IAdminLogin) {
	const response = await axios.post(`${API_URL}/api/v1/admin/login`, data, {
		withCredentials: true,
	})
	return response.data
}

export async function getAllKyc() {
	return await api.get("/api/v1/admin/kyc")
}

export async function getKycById(id: string) {
	const res = await api.get(`/api/v1/admin/kyc/${id}`)
	return res?.data
}

export async function updateKycByAdmin(data: IKycUpdateByAdmin, id: string) {
	const res = await api.put(`/api/v1/admin/kyc/${id}`, data)
	return res?.data
}

export async function getKycWithStatus(status: string) {
	const res = await api.get(`/api/v1/kyc/status/${status}`)
	return res?.data
}

export async function addCar(data: FormData) {
	const res = await api.post(`/api/v1/cars`, data)
	return res?.data
}

// get
export async function getAllCars(pageNumber: number) {
	try {
		const res = await api.get(`/api/v1/cars?pageNum=${pageNumber}`)
		return res?.data
	} catch (error) {
		console.error(error)
	}
}

// update
export async function updateCar(carId: string, data: FormData) {
	const res = await api.post(`/api/v1/cars/${carId}`, data)
	return res?.data
}

export async function getCarById(carId: string) {
	const res = await api.get(`/api/v1/cars/${carId}`)
	return res?.data
}

// delete
export async function deleteCarById(carId: string) {
	const res = await api.delete(`/api/v1/cars/${carId}`)
	return res?.data
}

export async function searchCarWithQuery(query: string) {
	const res = await api.get(`/api/v1/cars/search?${query}`)
	return res?.data
}
