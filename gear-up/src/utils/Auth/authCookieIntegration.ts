"use server"

import { IAdminLogin } from "@/app/types/admin.types"
import { ILogin, IRegister } from "@/app/types/auth.types"
import { authResponse } from "@/app/types/data.types"
import { cookies } from "next/dist/server/request/cookies"
import { DEFAULT_API_URL } from "../../lib/config"
import { getUserProfile } from "../API/UserAPI"
import { IUser } from "@/app/types/user.types"
import { encrypt } from "../encryption"

export async function authCookieIntegration(
	url: string,
	payload: ILogin | IRegister | IAdminLogin,
) {
	const cookieStore = await cookies()
	let error: string | null = null
	let success: string | null = null
	try {
		const res = await fetch(`${DEFAULT_API_URL}${url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
		const response = (await res.json()) satisfies authResponse

		// cookie integration
		if (response?.data?.accessToken && response?.data?.refreshToken) {
			cookieStore.set("access_token", response.data.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 5, // 5 minutes
			})
			cookieStore.set("refresh_token", response.data.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			})
		}
	} catch (error) {
		error = error instanceof Error ? error.message : String(error);
		console.error("Error happened in authCookieIntegration: ", error)
	}

	try {
		const userRes = await getUserProfile();
		if (userRes.ok) {
		  const userData: IUser = (await userRes.json()) satisfies IUser;
		  if (userData.data) {
			// Encrypt and store full user data in cookie
			const encryptedUserData = await encrypt(userData.data);
			cookieStore.set("user_data", encryptedUserData, {
			  httpOnly: true,
			  secure: true,
			  sameSite: "none",
			  maxAge: 60 * 60 * 24 * 7, // 7 days
			});
		  }
		}
	} catch (error) {
		error = error instanceof Error ? error.message : String(error);
		console.error("Fetching user data failed:", error);
	}
	success = "Authentication successful"
	return {ok: true, error, success}
}
