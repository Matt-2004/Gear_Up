import { MainResponse } from "@/app/types/data.types"
import { UserItem, UserResponse } from "@/app/types/user.types"
import { ResponseError } from "../Auth/ResponseError"
import { getUserProfile } from "../API/UserAPI"

export async function UserFetch(): Promise<UserResponse<UserItem>> {
	let response
	try {
		response = await getUserProfile()

		return response satisfies UserResponse<UserItem>
	} catch (error) {
		throw new ResponseError(response?.message, response?.status)
	}
}
