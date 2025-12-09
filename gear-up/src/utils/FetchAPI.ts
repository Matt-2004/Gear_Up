"use server"

import { IAdminLogin } from "@/app/types/admin.types"
import {
	ILoginFormData,
	INewPassword,
	IRegisterFormData,
} from "@/app/types/auth.types"
import { IKycUpdateByAdmin } from "@/app/types/kyc.types"
import { API_URL } from "@/lib/config"
import axios, { isAxiosError } from "axios"
import { cookies } from "next/headers"
import { getResetToken } from "./getClientCookie"

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
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 10, // 10 minutes
			})
		}
		if (response.data?.data.refreshToken) {
			cookieStore.set("refresh_token", response.data.data.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 7, // 7 days
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
				console.error("Server Error:", error.response.data)
				console.error("Status:", error.response.status)
			} else if (error.request) {
				// The request was made but no response was received.
				console.error("No Response:", error.request)
			} else {
				// Something happened in setting up the request that triggered an Error.
				console.error("Request Error:", error.message)
			}
		} else {
			// Handle other types of errors (e.g., network errors not from Axios)
			console.error("Unknown Error:", error)
		}
	}
}

export const api = axios.create({
	baseURL: API_URL,
})

// Interceptors for api request
api.interceptors.request.use(
	async (request) => {
		const cookieStore = await cookies()

		const accessToken =
			cookieStore.has("access_token") && cookieStore.get("access_token")?.value

		const refreshToken =
			cookieStore.has("refresh_token") &&
			cookieStore.get("refresh_token")?.value

		if (accessToken) {
			request.headers["Authorization"] = `Bearer ${accessToken}`
		} else if (refreshToken && !accessToken) {
			// generate new refresh/access token
			await rotateRefreshToken()

			const accessToken = cookieStore.get("access_token")?.value

			request.headers["Authorization"] = `Bearer ${accessToken}`
		}

		return request
	},
	(error) => {
		return Promise.reject(error)
	},
)

// interceptors for api response
api.interceptors.response.use(
	async (response) => {
		const cookieStore = await cookies()
		console.log("Response interceptor called", response.data)
		if (response.data?.data.accessToken) {
			console.log("New access token received in response")
			cookieStore.set("access_token", response.data.data.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 10, // 10 minutes
			})
		}
		if (response.data?.data.refreshToken) {
			console.log("New refresh token received in response")
			cookieStore.set("refresh_token", response.data.data.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 7, // 7 days
			})
		}
		return response
	},
	async (error) => {
		const originalRequest = error.config

		if (
			error.response.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes("/auth/refresh")
		) {
			originalRequest._retry = true
			console.log("Response interceptor: 401 detected, rotating token")

			return api(originalRequest)
		}
		return Promise.reject(error)
	},
)

export async function login(formData: ILoginFormData) {
	const res = await api.post(`/api/v1/auth/login`, formData)
	const cookieStore = await cookies()

	return res.data
}

export async function register(formData: IRegisterFormData) {
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

export async function getAllCars() {
	const res = await api.get("/api/v1/cars")
	return res?.data
}

export async function getFakeCars() {
	const res = await axios.get("/cardata.json")
	return res?.data
}

export async function updateCar(carId: string, data: FormData) {
	const res = await api.post(`/api/v1/cars/${carId}`, data)
	return res?.data
}

export async function getCarById(carId: string) {
	const res = await api.get(`/api/v1/cars/${carId}`)
	return res?.data
}
