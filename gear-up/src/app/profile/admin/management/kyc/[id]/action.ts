"use server"

import { IKycUpdateByAdmin } from "@/app/types/kyc.types"
import { updateKycByAdmin } from "@/utils/FetchAPI"
import { revalidatePath } from "next/cache"

import { redirect, RedirectType } from "next/navigation"

export const rejectOnSubmit = async (data: IKycUpdateByAdmin, id: string) => {
	await updateKycByAdmin(data, id)
	revalidatePath("profile/admin?tab=kyc-verification")
	redirect("/profile/admin?tab=kyc-verification", RedirectType.replace)
}
