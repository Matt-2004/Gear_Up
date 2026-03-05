"use server"

import { IAdminLogin } from "@/types/admin.types"
import { LoginDTO, RegisterDTO } from "@/types/auth.types"
import { encrypt } from "../encryption"
import { authFetchAPI } from "./authFetchAPI"
import { token_integration, user_data_integration } from "./CookieIntegration"
import { UserFetch } from "../User/UserFetch"

export async function authAPI(
	url: string,
	payload: LoginDTO | RegisterDTO | IAdminLogin,
) {
	const res = await authFetchAPI(url, payload)
	await token_integration(res.data)

	const userRes = await UserFetch()
	const encryptedUserData = await encrypt(userRes.data)
	await user_data_integration(encryptedUserData)
	console.log("user_data_integration is working...")
}
