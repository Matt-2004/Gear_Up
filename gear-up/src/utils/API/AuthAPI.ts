import { INewPassword } from "@/app/types/auth.types"
import { getResetToken } from "../getClientCookie"
import { postFetch } from "./AxiosClient"

export async function resendVerificationEmail(email: string) {
	const res = await postFetch(
		`/api/v1/auth/resend-verification-email/email?=${email}`,
		null,
	)
	return res
}

export async function updateNewPassword(data: INewPassword) {
	const reset_token = await getResetToken()

	const res = await postFetch(
		`/api/v1/auth/reset-password?token=${reset_token}`,
		data,
	)
	return res
}
