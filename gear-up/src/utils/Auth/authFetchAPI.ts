import {
	AuthItem,
	AuthResponse,
	LoginDTO,
	RegisterDTO,
} from "@/app/types/auth.types"
import { DEFAULT_API_URL } from "@/lib/config"
import { ResponseError } from "./ResponseError"
import { IAdminLogin } from "@/app/types/admin.types"

export async function authFetchAPI(
	url: string,
	payload: LoginDTO | RegisterDTO | IAdminLogin,
): Promise<AuthResponse<AuthItem>> {
	let response
	try {
		const res = await fetch(`${DEFAULT_API_URL}${url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
		response = await res.json()

		if (!res.ok) {
			throw new ResponseError(
				response?.message ?? `Request failed with status ${res.status}`,
				res.status,
			)
		}

		return response satisfies AuthResponse<AuthItem>
	} catch (error) {
		if (error instanceof ResponseError) throw error
		throw new ResponseError(String(error), response?.status ?? 500)
	}
}
