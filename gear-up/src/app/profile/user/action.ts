"use server"

import { updateUserProfile } from "@/utils/FetchAPI"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
	try {
		console.log("formData name:: ", formData.get("name"))
		console.log("formData username:: ", formData.get("username"))
		console.log("formData email:: ", formData.get("email"))
		console.log("formData phoneNumber:: ", formData.get("phoneNumber"))
		console.log("formData birthday:: ", formData.get("dateOfBirth"))
		const res = await updateUserProfile(formData)
		console.log("Profile update response:: ", res)
		revalidatePath("/profile/user")
	} catch (error) {
		console.error(error)
	}
}
