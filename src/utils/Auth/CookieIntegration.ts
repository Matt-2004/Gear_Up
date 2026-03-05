import { AuthItem, ProfileDTO } from "@/types/auth.types"
import { profileItem } from "@/types/data.types"
import { UserItem } from "@/types/user.types"
import { cookies } from "next/headers"

export async function token_integration(data: AuthItem) {
	const cookieStore = await cookies()
	cookieStore.set("access_token", data.accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 60 * 5, // 5 minutes
	})
	cookieStore.set("refresh_token", data.refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	})
}

export async function user_data_integration(userData: string) {
	const cookieStore = await cookies()
	cookieStore.set("user_data", userData, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	})
}
